import { useEffect, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { ITreasureHallProps } from "@/models/treasureHallModel";
import { NumberFormat } from "@/utils/format";
import { getPropsConfigIcon, PROPS_CONFIG } from "@/constrants/props";
import { TREASURE_GEARS_RARITY_MAP } from "../../constants";
import { CURRENCY_TYPE } from "@/constrants/enums";

interface ITreasureHallItemProps {
  data: ITreasureHallProps;
  onActive?: (data: ITreasureHallProps) => void;
  onSale?: (data: ITreasureHallProps) => void;
}

const TreasureHallItem: React.FC<ITreasureHallItemProps> = (props) => {
  const { data, onActive, onSale } = props;

  const [quality, setQuality] = useState("");
  const [qualityName, setQualityName] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [CPBoost, setCPBoost] = useState("0");
  const [GoBoostMin, setGOBoostMin] = useState("0");
  const [GoBoostMax, setGOBoostMax] = useState("0");

  const [ownedNums, setOwnedNums] = useState(1);


  const [isActived, setActived] = useState(false);

  const [salePrice, setSalePrice] = useState("0");
  const [saleCurrency, setSaleCurrency] = useState(0);

  const handleInitShopItem = async () => {
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

    const _quality = TREASURE_GEARS_RARITY_MAP[rarity] || "";

    const _props_local = PROPS_CONFIG[id] || null;
    const _img = await getPropsConfigIcon(_props_local);

    const _level_sort = level_values.sort((a, b) => {
      const level_a = a?.level || 0;
      const level_b = b?.level || 0;
      return level_a - level_b;
    });
    const _go_boost_min = _level_sort[0]?.speed || "0";
    const _go_boost_max = _level_sort[_level_sort.length - 1]?.speed || "0";

    const _isActived = activated_count > 0;

    setQualityName(_quality);
    setName(name);
    setImg(_img);
    setCPBoost(collection_points);
    setGOBoostMin(_go_boost_min);
    setGOBoostMax(_go_boost_max);
    setSalePrice(recycling_price);
    setSaleCurrency(recycling_currency);
    setActived(_isActived);
    setOwnedNums(holding_count);
  };

  const handleItemActive = () => {
    if (!ownedNums) return;

    onActive && onActive(data);
  };

  const handleItemSale = () => {
    if (!ownedNums) return;


    onSale && onSale(data);
  };

  useEffect(() => {
    handleInitShopItem();
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
      {/* 名称 */}
      <div className={styles["item-name"]}>{name}</div>
      {/* 图标 */}
      <div className={styles["item-icon"]}>
        {img && <img src={img} draggable={false} />}
      </div>

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

      <div className={styles["block-control-list"]}>
        <div className={styles["block-control"]}>
          <div
            className={classNames(
              styles["item-owned"],
              !isActived && styles["item-owned-none"]
            )}
          >
            <div className={styles["owned-icon"]}></div>
            <div className={styles["owned-name"]}>
              {isActived ? "Owned" : "None"}
            </div>
          </div>
          <div
            className={classNames(
              styles["control-btn"],
              styles["control-btn-blue"],
              !ownedNums && styles["control-btn-disable"]
            )}
            onClick={handleItemActive}
          >
            <div className={styles["control-btn-bg"]}>
              <div className={styles["control-btn-text"]}>
                Activate {ownedNums}
              </div>
            </div>
          </div>
        </div>

        <div className={styles["block-control"]}>
          <div className={styles["item-sale"]}>
            <div
              className={classNames(
                styles["item-sale-icon"],
                styles[`item-sale-icon-${saleCurrency}`]
              )}
            ></div>
            <div className={styles["item-sale-text"]}>{salePrice}</div>
          </div>
          <div
            className={classNames(
              styles["control-btn"],
              styles["control-btn-purple"],
              !ownedNums && styles["control-btn-disable"]
            )}
            onClick={handleItemSale}
          >
            <div className={styles["control-btn-bg"]}>
              <div className={styles["control-btn-text"]}>Sell {ownedNums}</div>
            </div>
          </div>
        </div>
      </div>

      {!isActived && !ownedNums && <div className={styles["item-mask"]}></div>}
    </div>
  );
};

export default TreasureHallItem;
