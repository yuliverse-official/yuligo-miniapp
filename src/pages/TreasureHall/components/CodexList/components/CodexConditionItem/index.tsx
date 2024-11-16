import { useEffect, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { getPropsConfigIcon, PROPS_CONFIG } from "@/constrants/props";

interface ICodexConditionItemProps {
  data: any;
  isFix?: boolean;
  onStatusChange?: (data: any) => void;
}

const CodexConditionItem: React.FC<ICodexConditionItemProps> = (props) => {
  const { data, isFix = false, onStatusChange } = props;

  const [id, setId] = useState("");
  const [img, setImg] = useState("");

  const [ownedNums, setOwnedNums] = useState(0);
  const [needNums, setNeedNums] = useState(1);

  const [isEnough, setEnough] = useState(false);

  const handleInitItem = async () => {
    const id = data?.id || data;
    const name = data?.name || "";

    const _props_local = PROPS_CONFIG[id] || null;
    const _img = await getPropsConfigIcon(_props_local);

    const activated_count = data?.activated_count || 0;

    setId(id);
    setImg(_img);
    setOwnedNums(activated_count);
  };

  useEffect(() => {
    if (isFix) return;
    if (!needNums) return;
    const isEnough = ownedNums >= needNums;
    setEnough(isEnough);
  }, [ownedNums, needNums, isFix]);

  useEffect(() => {
    if (!id) return;
    onStatusChange &&
      onStatusChange({
        id,
        isEnough,
      });
  }, [isEnough]);

  useEffect(() => {
    if (!data) return;
    handleInitItem();
  }, [data, isFix]);

  return (
    <div className={styles["item"]}>
      <div className={classNames(styles["item-box"])}>
        {/* 图标 */}
        <div className={styles["item-icon"]}>
          {img && <img src={img} draggable={false} />}
        </div>

        {!isFix && !isEnough && (
          <div className={styles["item-box-unable"]}></div>
        )}
        {(isEnough || isFix) && <div className={styles["item-check"]}></div>}
      </div>

      <div className={styles["item-value"]}>
        {isFix ? needNums : ownedNums}/{needNums}
      </div>
    </div>
  );
};

export default CodexConditionItem;
