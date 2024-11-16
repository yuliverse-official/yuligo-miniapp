import { getPropsConfigIcon, PROPS_CONFIG } from "@/constrants/props";
import styles from "./styles.less";
import classNames from "classnames";
import { useEffect, useState } from "react";

interface IHuntRecordItemProps {
  data: any;
}

const HuntRecordItem: React.FC<IHuntRecordItemProps> = (props) => {
  const { data } = props;

  const [itemName, setItemName] = useState("");
  const [itemIcon, setItemIcon] = useState("");
  const [recordLocation, setRecordLocation] = useState("");
  const [recordTime, setRecordTime] = useState("");

  const handleInitData = async () => {
    const id = data?.id || "";
    const name = data?.name || "";
    const region = data?.region || "";
    const created_at = data?.created_at || 0;

    const _props_local = PROPS_CONFIG[id] || null;
    const _img = await getPropsConfigIcon(_props_local);

    setItemName(name);
    setItemIcon(_img);
    setRecordLocation(region);
    setRecordTime(handleGetRecordTimeFormat(created_at * 1000));
  };

  const handleGetRecordTimeFormat = (timestamp: number) => {
    if (!timestamp) return "";
    const _date = new Date(timestamp);
    const year = _date.getUTCFullYear();
    const month = _date.getUTCMonth() + 1;
    const day = _date.getUTCDate();
    const hours = _date.getUTCHours();
    const mins = _date.getUTCMinutes();
    return `${month}/${day} ${year} ${handleSecondsFormat(
      hours
    )}:${handleSecondsFormat(mins)} UTC+0`;
  };

  const handleSecondsFormat = (num: number) => {
    return num > 9 ? num : `0${num}`;
  };

  useEffect(() => {
    if (!data) return;
    handleInitData();
  }, [data]);

  return (
    <div className={styles["item"]}>
      <div className={styles["item-name"]}>{itemName}</div>
      <div className={styles["item-icon"]}>
        {itemIcon && <img src={itemIcon} draggable={false} />}
      </div>

      <div className={styles["item-record"]}>
        <div className={styles["record-title"]}>Treasure Hunt Location</div>
        <div className={styles["item-row"]}>
          <div
            className={classNames(
              styles["item-row-icon"],
              styles["item-row-icon-location"]
            )}
          ></div>
          <div className={styles["item-row-text"]}>{recordLocation}</div>
        </div>
        <div className={styles["item-row"]}>
          <div
            className={classNames(
              styles["item-row-icon"],
              styles["item-row-icon-time"]
            )}
          ></div>
          <div className={styles["item-row-text"]}>{recordTime}</div>
        </div>
      </div>
    </div>
  );
};

export default HuntRecordItem;
