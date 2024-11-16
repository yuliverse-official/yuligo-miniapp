import { useEffect, useRef, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { getPropsConfigIcon, PROPS_CONFIG } from "@/constrants/props";
import { TREASURE_GEARS_RARITY_MAP } from "../../../../constants";
import { NumberFormat } from "@/utils/format";
import CodexConditionItem from "../CodexConditionItem";
import { ITreasureHallProps } from "@/models/treasureHallModel";
import { useModel } from "@umijs/max";
import { CURRENCY_TYPE } from "@/constrants/enums";

interface ICodexItemProps {
  data: ITreasureHallProps;
  onClaim?: (data: ITreasureHallProps) => void;
}

const ACTIVED_COUNT = 1;

const CodexItem: React.FC<ICodexItemProps> = (props) => {
  const { data, onClaim } = props;

  const { handleGetGearByName } = useModel("treasureHallModel");

  const [quality, setQuality] = useState("");
  const [qualityName, setQualityName] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [CPBoost, setCPBoost] = useState("0");
  const [GoBoostMin, setGOBoostMin] = useState("0");
  const [GoBoostMax, setGOBoostMax] = useState("0");

  // 售卖价格
  const [salePrice, setSalePrice] = useState("0");
  const [saleCurrency, setSaleCurrency] = useState(0);

  // 解锁所需条件
  const [conditionList, setConditionList] = useState<ITreasureHallProps[]>([]);
  const [conditionMap, setConditionMap] = useState({});
  const conditionMapRef = useRef<any>({});
  const [isCanClaim, setCanClaim] = useState(false);

  // 是否已解锁
  const [isClaimed, setClaimed] = useState(false);

  const handleInitItem = async () => {
    const id = data?.id || "";
    const rarity = data?.rarity || "";
    const name = data?.name || "";
    const collection_points = data?.collection_points || "0";
    const level_values = data?.level_values || [];
    const recycling_price = data?.recycling_price || "0";
    const recycling_currency =
      data?.recycling_currency || CURRENCY_TYPE.TOKEN_GO;
    const activated_count = data?.activated_count || 0;
    const holding_count = data?.holding_count || 0;
    const is_activated = data?.is_activated || false;

    const _quality = TREASURE_GEARS_RARITY_MAP[rarity] || "";

    const _props_local = PROPS_CONFIG[id] || null;
    const _img = await getPropsConfigIcon(_props_local);

    const _level_sort = level_values.sort((a: any, b: any) => {
      const level_a = a?.level || 0;
      const level_b = b?.level || 0;
      return level_a - level_b;
    });
    const _go_boost_min = _level_sort[0]?.speed || "0";
    const _go_boost_max = _level_sort[_level_sort.length - 1]?.speed || "0";

    // @ts-ignore
    const condition: any[] = data?.unlock_conditions || [];

    // 获取条件对象
    const _unlock_conditions_details: ITreasureHallProps[] = [];
    for (const i in condition) {
      const _name = condition[i];
      const _data: ITreasureHallProps = await handleGetGearByName(_name);
      _unlock_conditions_details.push(_data);
    }

    // 判断当前条件状态
    const _condition_map: any = {};
    for (const i in _unlock_conditions_details) {
      const item = _unlock_conditions_details[i];
      const id = item?.id;
      const activated_count = item?.activated_count || 0;
      const is_activated = item?.is_activated;
      _condition_map[id] = activated_count >= ACTIVED_COUNT || is_activated;
    }
    conditionMapRef.current = _condition_map;
    setConditionMap(_condition_map);
    setConditionList(_unlock_conditions_details);

    // 检测是否满足条件
    const _isEnough = handleCheckCondition();
    setCanClaim(_isEnough);

    const isClaimed = activated_count > 0 || holding_count > 0 || is_activated;
    setClaimed(isClaimed);

    setQualityName(_quality);
    setName(name);
    setImg(_img);
    setCPBoost(collection_points);
    setGOBoostMin(_go_boost_min);
    setGOBoostMax(_go_boost_max);
    setSalePrice(recycling_price);
    setSaleCurrency(recycling_currency);
  };

  const handleClaimClick = () => {
    if (isClaimed || !isCanClaim) return;

    console.log("handleClaimClick", data);

    onClaim && onClaim(data);
  };

  const handleConditionStatusChange = (data: any) => {
    const { id, isEnough } = data;

    const _map: any = { ...conditionMapRef.current };
    _map[id] = isEnough;
    conditionMapRef.current = _map;
    setConditionMap(_map);
  };

  const handleCheckCondition = () => {
    const list = [];
    for (const i in conditionMapRef.current) {
      // @ts-ignore
      const isEnough = conditionMapRef.current[i];
      list.push(isEnough);
    }

    if (!list.length) {
      return false;
    }

    const _isEnough = list.every((item) => {
      return item;
    });

    return _isEnough;
  };

  useEffect(() => {
    if (isClaimed) return;
    const _isEnough = handleCheckCondition();
    setCanClaim(_isEnough);
  }, [conditionMap]);

  useEffect(() => {
    if (!data) return;
    handleInitItem();
  }, [data]);

  return (
    <div className={styles["item"]}>
      {/* 品质 */}
      <div
        className={classNames(
          styles["item-quality"],
          styles[`item-quality-${qualityName}`]
        )}
      ></div>

      <div className={styles["block-info"]}>
        {/* 名称 */}
        <div className={styles["item-name"]}>{name}</div>

        {/* 数值 */}
        <div className={styles["item-boost-list"]}>
          {/* CP Boost */}
          <div className={styles["item-boost"]}>
            <div className={styles["item-boost-row"]}>
              <div
                className={classNames(
                  styles["item-boost-icon"],
                  styles["item-boost-icon-cp"]
                )}
              ></div>
              <div className={styles["item-boost-name"]}>Boost</div>
            </div>
            <div className={styles["item-boost-value"]}>{CPBoost}</div>
          </div>
          {/* GO Boost */}
          <div className={styles["item-boost"]}>
            <div className={styles["item-boost-row"]}>
              <div
                className={classNames(
                  styles["item-boost-icon"],
                  styles["item-boost-icon-go"]
                )}
              ></div>
              <div className={styles["item-boost-name"]}>Boost</div>
            </div>
            <div className={styles["item-boost-value"]}>
              {NumberFormat(Number(GoBoostMin))}~
              {NumberFormat(Number(GoBoostMax))}/h
            </div>
          </div>
        </div>

        {/* 解锁条件 */}
        <div className={styles["block-codex-list"]}>
          <div className={styles["item-codex-name"]}>Collection Codex</div>
          <div className={styles["item-codex-list"]}>
            {conditionList.map((item: any, index: number) => {
              return (
                <div className={styles["item-codex-item"]} key={index}>
                  <CodexConditionItem
                    data={item}
                    // onStatusChange={handleConditionStatusChange}
                    isFix={isClaimed}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles["block-info-2"]}>
        {isClaimed && <div className={styles["item-claimed-icon"]}></div>}

        {/* 图标 */}
        <div className={styles["item-icon"]}>
          {img && <img src={img} draggable={false} />}
        </div>

        {/* 售卖价格 */}
        <div className={styles["item-sale"]}>
          <div
            className={classNames(
              styles["item-sale-icon"],
              styles[`item-sale-icon-${saleCurrency}`]
            )}
          ></div>
          <div className={styles["item-sale-text"]}>{salePrice}</div>
        </div>

        <div className={styles["block-control"]}>
          <div
            className={classNames(
              styles["item-btn"],
              !isClaimed && !isCanClaim && styles["item-btn-unable"],
              isClaimed && styles["item-btn-claimed"]
            )}
            onClick={handleClaimClick}
          >
            <div className={styles["item-btn-bg"]}>
              {isClaimed && <div className={styles["item-btn-icon"]}></div>}
              <div className={styles["item-btn-name"]}>
                {isClaimed ? "Claimed" : "Claim"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodexItem;
