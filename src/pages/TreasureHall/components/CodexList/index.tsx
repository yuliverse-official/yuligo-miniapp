import { useEffect, useRef, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import CodexItem from "./components/CodexItem";
import { getPropsConfigIcon, PROPS_CONFIG } from "@/constrants/props";
import { TOAST_TYPE } from "@/components/NewToast";
import { ITreasureHallProps } from "@/models/treasureHallModel";
import { useModel } from "@umijs/max";
import ModelBase from "@/components/ModelBase";
import { postTreasureHallCodex } from "@/services/CityTreasureHunt";

const CodexList: React.FC = () => {
  const {
    UpdateTreasureHallGears,
    handleGetCodexByGears,
    handleGetGearByName,
  } = useModel("treasureHallModel");

  const [recordList, setRecordList] = useState<ITreasureHallProps[]>([]);

  const [selectedData, setSelectedData] = useState<ITreasureHallProps>();
  const [selectedDataId, setSelectedDataId] = useState("");
  const [selectedDataIcon, setSelectedDataIcon] = useState("");
  const [selectedDataName, setSelectedDataName] = useState("");

  const [isRequestLoading, setRequestLoading] = useState(false);

  const [isClaimSuccessShow, setClaimSuccessShow] = useState(false);

  const handleGetCodexRecord = async () => {
    window.ShowLoading();

    // 获取列表
    const data = await handleGetCodexByGears();
    await handleParseData(data);

    window.HideLoading();
  };

  const handleParseData = async (list: any) => {
    const _list = [...list];

    // 按照Ton回收价格排序
    const _list_sort_price = _list.sort(
      (a: ITreasureHallProps, b: ITreasureHallProps) => {
        const recycling_price_a = Number(a?.recycling_price || 0);
        const recycling_price_b = Number(b?.recycling_price || 0);
        return recycling_price_b - recycling_price_a;
      }
    );

    // 将已领取的排序到末尾
    const _list_sort_claim = [];
    const _list_sort_unclaim = [];
    for (const i in _list_sort_price) {
      const item = _list_sort_price[i];
      const activated_count = item?.activated_count || 0;
      const holding_count = item?.holding_count || 0;
      const is_activated = item?.is_activated || false;
      const isClaimed =
        activated_count > 0 || holding_count > 0 || is_activated;

      isClaimed && _list_sort_claim.push(item);
      !isClaimed && _list_sort_unclaim.push(item);
    }

    const _list_sort = [..._list_sort_unclaim, ..._list_sort_claim];

    setRecordList(_list_sort);
  };

  const handleClaimClick = async (data: any) => {
    const id = data?.id || "";
    const name = data?.name || "";
    const _props_local = PROPS_CONFIG[id] || null;
    const _img = await getPropsConfigIcon(_props_local);

    setSelectedData(data);
    setSelectedDataId(id);
    setSelectedDataIcon(_img);
    setSelectedDataName(name);

    handleClaim(data);
  };

  const handleClaim = async (data: any) => {
    try {
      if (isRequestLoading) return;

      setRequestLoading(true);

      const id = data?.id || "";
      const res = await postTreasureHallCodex({ id });

      handleRefreshItem();

      setClaimSuccessShow(true);
      setRequestLoading(false);
    } catch {
      setRequestLoading(false);
      window.ShowToast(
        "Claim failed, please try again later!",
        TOAST_TYPE.Error,
        3000
      );
    }
  };

  const handleRefreshItem = async () => {
    // 藏宝阁列表
    const list: ITreasureHallProps[] = await UpdateTreasureHallGears();

    // 当前列表
    const data = await handleGetCodexByGears(list);
    await handleParseData(data);
  };

  useEffect(() => {
    handleGetCodexRecord();
  }, []);

  const POPUP_REWARD_CONTENT_NODE = (
    <div className={styles["reward"]}>
      <div className={styles["reward-icon"]}>
        {selectedDataIcon && <img src={selectedDataIcon} draggable={false} />}
      </div>
      <div className={styles["reward-name"]}>{selectedDataName || ""}</div>
    </div>
  );

  return (
    <div className={styles["pages"]}>
      <div className={styles["block-content-list"]}>
        {!recordList?.length && (
          <div className={styles["block-content-default"]}>
            <div className={styles["block-content-default-icon"]}></div>
            <div className={styles["block-content-default-text"]}>
              The treasure hall is completely empty!
            </div>
          </div>
        )}
        {!!recordList?.length && (
          <>
            {recordList.map((item: any, index: number) => {
              return (
                <div className={styles["block-content-item"]} key={index}>
                  <CodexItem data={item} onClaim={handleClaimClick} />
                </div>
              );
            })}
          </>
        )}
      </div>

      {isClaimSuccessShow && (
        <ModelBase
          visible={isClaimSuccessShow}
          onClose={() => setClaimSuccessShow(false)}
          title={"REWARD"}
          contentNode={POPUP_REWARD_CONTENT_NODE}
          ContentClass={styles["popup-content"]}
          maskCloseEnable={false}
        />
      )}
    </div>
  );
};

export default CodexList;
