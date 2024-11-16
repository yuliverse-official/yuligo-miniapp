import BackpackItemTab from "@/pages/Backpack/components/BackpackItemTab";
import styles from "./styles.less";
import classNames from "classnames";
import {
  BACKPACK_ITEM_TAB_ENUM,
  BACKPACK_ITEM_TAB_LIST,
} from "@/pages/Backpack/constants";
import { useEffect, useState } from "react";
import { ITreasureHallProps } from "@/models/treasureHallModel";
import { useModel } from "@umijs/max";
import { TOAST_TYPE } from "@/components/NewToast";
import TreasureHallItem from "../TreasureHallItem";
import {
  TREASUER_ITEM_FILTER_LIST,
  TREASURE_ITEM_FILTER,
} from "../../constants";
import ModelBase from "@/components/ModelBase";
import { history } from "umi";
import { TAB_ENUM } from "@/components/AppTabs";
import { postTreasureHallGears } from "@/services/CityTreasureHunt";
import { Popover } from "antd-mobile";
import { CURRENCY_TYPE } from "@/constrants/enums";

interface ITreasureHallItemListProps {
  itemKey?: BACKPACK_ITEM_TAB_ENUM | string;
}

const enum GEARS_CONTROL_ENUM {
  ACTIVE = 1,
  SALE = 2,
}

const TreasureHallItemList: React.FC<ITreasureHallItemListProps> = (props) => {
  const { itemKey } = props;

  const { treasureHallGears, handleGetGearsByFilter, UpdateTreasureHallGears } =
    useModel("treasureHallModel");
  const { userInfo, updateUserInfoHanlde } = useModel("useUserInfoModel");

  const { backNum, setBackNum } = useModel("menuStatus");

  const [activeKey, setActiveKey] = useState("");
  const [activeItem, setActiveItem] = useState<any>(null);

  const [filterKey, setFilterKey] = useState(TREASURE_ITEM_FILTER.ALL);

  const [treasureHallList, setTreasureHallList] = useState<
    ITreasureHallProps[]
  >([]);

  const [selectedData, setSelectedData] = useState<any>(null);
  const [selectedDataId, setSelectedDataId] = useState("");
  const [selectedDataCP, setSelectedDataCP] = useState("0");
  const [selectedDataCurrency, setSelectedDataCurrency] = useState(0);
  const [isActiveConfirmShow, setActiveConfirmShow] = useState(false);
  const [isActiveSuccessShow, setActiveSuccessShow] = useState(false);

  const [isSaleConfirmShow, setSaleConfirmShow] = useState(false);
  const [isSaleResultShow, setSaleResultShow] = useState(false);
  const [isSaleSuccessShow, setSaleSuccessShow] = useState(false);
  const [isSaleErrorShow, setSaleErrorShowShow] = useState(false);

  const [isRequestLoading, setRequestLoading] = useState(false);

  const [isFilterBoxShow, setFilterBoxShow] = useState(false);

  const handleTabClick = (key: BACKPACK_ITEM_TAB_ENUM) => {
    if (key === activeKey) {
      return;
    }

    setActiveKey(key);
  };

  const handleChangeFilter = (key: TREASURE_ITEM_FILTER) => {
    if (key === filterKey) {
      return;
    }

    setFilterKey(key);
    setFilterBoxShow(false);
  };

  const handleRefreshShopList = async () => {
    window.ShowLoading();

    const data: ITreasureHallProps[] = await handleGetGearsByFilter(activeKey);
    const _data_filter = await handleParseDataExtra(data);
    setTreasureHallList(_data_filter);

    // 滚动到顶部
    const el = document.querySelector("#shopList");
    el && el.scrollTo(0, 0);

    window.HideLoading();
  };

  const handleParseDataExtra = (data: ITreasureHallProps[]) => {
    // 以CP值排序
    const _data_sort = data?.sort((a, b) => {
      const cp_a = Number(a?.collection_points || 0);
      const cp_b = Number(b?.collection_points || 0);
      return cp_b - cp_a;
    });

    // 根据Filter过滤
    let _data_filter = [..._data_sort];
    if (filterKey === TREASURE_ITEM_FILTER.OWNED) {
      const _filter = _data_sort.filter((item) => {
        const holding_count = item?.holding_count || 0;
        const activated_count = item?.activated_count || 0;
        return holding_count > 0 || activated_count > 0;
      });
      _data_filter = [..._filter];
    }

    return _data_filter;
  };

  const handleItemActiveClick = (data: ITreasureHallProps) => {
    const id = data?.id || "";
    const collection_points = data?.collection_points || "0";
    setSelectedData(data);
    setSelectedDataId(id);
    setSelectedDataCP(collection_points);
    setActiveConfirmShow(true);
  };

  const handleItemSaleClick = (data: ITreasureHallProps) => {
    const id = data?.id || "";
    const recycling_currency =
      data?.recycling_currency || CURRENCY_TYPE.TOKEN_GO;
    setSelectedDataCurrency(recycling_currency);
    setSelectedData(data);
    setSelectedDataId(id);

    setSaleConfirmShow(true);
  };

  const handleItemActive = async () => {
    try {
      if (isRequestLoading) return;

      setRequestLoading(true);

      const res = await postTreasureHallGears({
        id: selectedDataId,
        use_type: GEARS_CONTROL_ENUM.ACTIVE,
      });

      handleRefreshItem();
      updateUserInfoHanlde();

      setActiveSuccessShow(true);
      setRequestLoading(false);
    } catch (error) {
      setRequestLoading(false);
      window.ShowToast(
        "Active failed, please try again later!",
        TOAST_TYPE.Error,
        3000
      );
    }
  };

  const handleItemSale = async () => {
    try {
      if (isRequestLoading) return;

      const address = userInfo?.wallet_info?.address || "";
      if (!address) {
        setSaleResultShow(true);
        setSaleErrorShowShow(true);
        return;
      }

      setRequestLoading(true);

      const res = await postTreasureHallGears({
        id: selectedDataId,
        use_type: GEARS_CONTROL_ENUM.SALE,
      });

      handleRefreshItem();
      if (selectedDataCurrency === CURRENCY_TYPE.TOKEN_GO) {
        updateUserInfoHanlde();
      }

      setSaleResultShow(true);
      setSaleSuccessShow(true);
      setRequestLoading(false);
    } catch (error) {
      setRequestLoading(false);
      window.ShowToast(
        "Sale failed, please try again later!",
        TOAST_TYPE.Error,
        3000
      );
    }
  };

  const handleSaleResultClick = () => {
    if (isSaleErrorShow) {
      history.push("/Account");
      setBackNum(TAB_ENUM.Account);
    }

    if (isSaleSuccessShow) {
      setSaleConfirmShow(false);
      setSaleResultShow(false);
      setSaleSuccessShow(false);
    }
  };

  const handleRefreshItem = async () => {
    const list: ITreasureHallProps[] = await UpdateTreasureHallGears();
    const _data: ITreasureHallProps[] = await handleGetGearsByFilter(
      activeKey,
      list
    );
    const _data_filter = await handleParseDataExtra(_data);
    setTreasureHallList(_data_filter);
  };

  useEffect(() => {
    setActiveKey(itemKey ? itemKey : BACKPACK_ITEM_TAB_ENUM.FEET);
  }, [itemKey]);

  useEffect(() => {
    if (!activeKey || !filterKey) return;

    handleRefreshShopList();
  }, [activeKey, filterKey]);

  const CONTENT_ACTIVE_CONFIRM = (
    <div className={styles["popup-content-confirm"]}>
      <div className={styles["popup-confirm-text"]}>
        Once activated, you'll get CP and items, but you won't be able to sell
        them anymore. Do you want to proceed?
      </div>
      <div
        className={styles["popup-confirm-control"]}
        style={{ marginTop: "60px" }}
      >
        <div
          className={styles["btn-cancel"]}
          onClick={() => {
            if (isRequestLoading) return;
            setActiveConfirmShow(false);
          }}
        >
          <div className={styles["btn-cancel-text"]}>Cancel</div>
        </div>
        <div
          className={styles["btn-confirm"]}
          style={{ marginLeft: "10px" }}
          onClick={handleItemActive}
        >
          {!isRequestLoading && (
            <div className={styles["btn-confirm-text"]}>Confirm</div>
          )}
          {isRequestLoading && (
            <div className={styles["btn-confirm-loading"]}></div>
          )}
        </div>
      </div>
    </div>
  );

  const CONTENT_ACTIVE_SUCCESS = (
    <div className={styles["popup-content-success"]}>
      <div className={styles["row"]}>
        <div className={styles["success-icon"]}></div>
        <div className={styles["success-text"]}>
          Activation successful! You've received
        </div>
      </div>
      <div className={styles["row"]} style={{ marginTop: "30px" }}>
        <div className={styles["cp-icon"]}></div>
        <div className={styles["cp-text"]}>
          {selectedDataCP ? Number(selectedDataCP).toLocaleString("en") : "0"}
        </div>
      </div>
      <div
        className={classNames(
          styles["btn-confirm"],
          styles["btn-confirm-large"]
        )}
        style={{ marginTop: "37px" }}
        onClick={() => {
          setActiveConfirmShow(false);
          setActiveSuccessShow(false);
        }}
      >
        <div className={styles["btn-confirm-text"]}>Confirm</div>
      </div>
    </div>
  );

  const CONTENT_SALE_CONFIRM = (
    <div className={styles["popup-content-confirm"]}>
      <div
        className={styles["popup-confirm-text"]}
        style={{ textAlign: "left" }}
      >
        Once sold, you won't be able to activate it or gain CP and use it. Do
        you want to proceed?
      </div>
      <div className={styles["popup-confirm-text-sub"]}>
        <div className={styles["popup-confirm-text-sub-text"]}>
          *If you proceed with the sale, a portion of the sale price will be
          deducted as a Gas fee for sending Ton. The Ton earned from the sale
          will be sent to your linked address.
        </div>
      </div>
      <div
        className={styles["popup-confirm-control"]}
        style={{ marginTop: "38px" }}
      >
        <div
          className={styles["btn-cancel"]}
          onClick={() => {
            if (isRequestLoading) return;
            setSaleConfirmShow(false);
          }}
        >
          <div className={styles["btn-cancel-text"]}>Cancel</div>
        </div>
        <div
          className={styles["btn-confirm"]}
          style={{ marginLeft: "10px" }}
          onClick={handleItemSale}
        >
          {!isRequestLoading && (
            <div className={styles["btn-confirm-text"]}>Confirm</div>
          )}
          {isRequestLoading && (
            <div className={styles["btn-confirm-loading"]}></div>
          )}
        </div>
      </div>
    </div>
  );

  const CONTENT_SALE_RESULT = (
    <div
      className={styles["popup-content-confirm"]}
      style={{ marginTop: "84px" }}
    >
      <div className={styles["popup-confirm-text"]} style={{ height: "56px" }}>
        {isSaleSuccessShow
          ? selectedDataCurrency === CURRENCY_TYPE.TON
            ? "Sale successful! Your linked wallet will receive the Ton within a certain time."
            : "Sale successful! Your will receive the Go within a certain time."
          : "You haven't linked a wallet to receive Ton yet. Please proceed to link your account."}
      </div>
      <div
        className={classNames(
          styles["btn-confirm"],
          styles["btn-confirm-large"]
        )}
        style={{ marginTop: "69px" }}
        onClick={handleSaleResultClick}
      >
        <div className={styles["btn-confirm-text"]}>Confirm</div>
      </div>
    </div>
  );

  const FILTER_BOX_NODE = (
    <div className={styles["filter-box"]}>
      {TREASUER_ITEM_FILTER_LIST.map((item, index) => {
        return (
          <div
            className={classNames(
              styles["filter-box-item"],
              item?.key === filterKey && styles["filter-box-item-active"]
            )}
            key={index}
            onClick={() => handleChangeFilter(item?.key)}
          >
            <div className={styles["filter-box-item-text"]}>{item?.name}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles["pages"]}>
      <div className={styles["block-header"]}>
        <div className={styles["block-item-tab"]}>
          <BackpackItemTab
            tabList={BACKPACK_ITEM_TAB_LIST}
            activeKey={activeKey}
            onClick={handleTabClick}
          />
        </div>
        <div className={styles["block-filter"]}>
          <Popover
            content={FILTER_BOX_NODE}
            trigger="click"
            placement="bottom-start"
            visible={isFilterBoxShow}
          >
            <div
              className={styles["block-filter-icon"]}
              onClick={() => setFilterBoxShow(true)}
            ></div>
          </Popover>
        </div>
      </div>
      <div className={styles["block-content-list"]} id="shopList">
        {!treasureHallList?.length && (
          <div className={styles["block-content-default"]}>
            <div className={styles["block-content-default-icon"]}></div>
            <div className={styles["block-content-default-text"]}>
              This type of treasure isn't available in the hall yet—stay tuned!
            </div>
          </div>
        )}
        {!!treasureHallList?.length && (
          <>
            {treasureHallList.map((item: any, index: number) => {
              return (
                <div className={styles["block-content-item"]} key={index}>
                  <TreasureHallItem
                    data={item}
                    onActive={handleItemActiveClick}
                    onSale={handleItemSaleClick}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      {isActiveConfirmShow && (
        <ModelBase
          visible={isActiveConfirmShow}
          onClose={() => setActiveConfirmShow(false)}
          titleNode={<></>}
          contentNode={
            isActiveSuccessShow
              ? CONTENT_ACTIVE_SUCCESS
              : CONTENT_ACTIVE_CONFIRM
          }
          ContentClass={styles["popup-content"]}
          maskCloseEnable={false}
        />
      )}

      {isSaleConfirmShow && (
        <ModelBase
          visible={isSaleConfirmShow}
          onClose={() => setSaleConfirmShow(false)}
          titleNode={<></>}
          contentNode={
            isSaleResultShow ? CONTENT_SALE_RESULT : CONTENT_SALE_CONFIRM
          }
          ContentClass={styles["popup-content"]}
          maskCloseEnable={false}
        />
      )}
    </div>
  );
};

export default TreasureHallItemList;
