import { useEffect, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { ITreasureHallProps } from "@/models/treasureHallModel";
import { getPropsConfigIcon, PROPS_CONFIG } from "@/constrants/props";
import { NumberFormat } from "@/utils/format";
import { useModel } from "@umijs/max";

interface IBackpackGearItemProps {
  data: ITreasureHallProps;
  onEquip?: (data: any) => void;
}

const BackpackGearItem: React.FC<IBackpackGearItemProps> = (props) => {
  const { data, onEquip } = props;

  const { getRoleInfoByRoleType } = useModel("rolesModel");

  const [name, setName] = useState("");
  const [imgIcon, setImgIcon] = useState(null);
  const [boost, setBoost] = useState("0");
  const [level, setLevel] = useState(0);
  const [isEquip, setEquip] = useState(false);

  const handleInitGearItem = async () => {
    const id = data?.id || "";
    const name = data?.name || "";
    const level = data?.level || 0;
    const level_values = data?.level_values || [];
    const role_id = data?.role_id || "";

    const _props_local = PROPS_CONFIG[id] || null;
    const _img = await getPropsConfigIcon(_props_local);

    const _level_item = level_values.find((item) => {
      return item?.level === level;
    });
    const speed = _level_item?.speed || "0";

    // 判断是否装备时根据当前角色判断
    const _role_info = await getRoleInfoByRoleType();
    const _role_id = _role_info?.role_id;
    const isEquip = !!role_id && role_id === _role_id;

    setName(name);
    setImgIcon(_img);
    setLevel(level);
    setBoost(speed);
    setEquip(isEquip);
  };

  const handleItemEquipClick = () => {
    onEquip && onEquip(data);
  };

  useEffect(() => {
    handleInitGearItem();
  }, [data]);

  return (
    <div className={styles["item"]}>
      <div className={styles["item-name"]}>{name}</div>
      <div className={styles["item-decorate-line"]}></div>
      <div className={styles["item-boost"]}>
        Boost
        <br />
        {NumberFormat(Number(boost))}/h
      </div>
      <div className={styles["item-icon"]}>
        {imgIcon && <img src={imgIcon} draggable={false} />}
      </div>
      <div
        className={classNames(
          styles["item-status-bar"],
          isEquip && styles["item-status-bar-equip"]
        )}
      >
        <div className={styles["item-level"]}>Lv.{level}</div>
        {isEquip ? (
          <div className={styles["item-equipped"]}>
            <div className={styles["equipped-icon"]}></div>
            <div className={styles["equipped-name"]}>Equipped</div>
          </div>
        ) : (
          <div
            className={styles["item-equip-btn"]}
            onClick={handleItemEquipClick}
          >
            <div className={styles["item-equip-btn-name"]}>Equip</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackpackGearItem;
