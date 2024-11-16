import { Mask } from "antd-mobile";
import styles from "./index.less";
import classNames from "classnames";
import { useModel, history } from "umi";
import storage from "@/utils/storage";
import { isToday } from "@/utils/time";
import ModelBase from "@/components/ModelBase";

interface Iporps {
  text: string;
  onClose: () => void;
  visiable: boolean;
}

const TryAgainPopup: React.FC<Iporps> = (props) => {
  const { text, visiable, onClose } = props;
  const closeHanlde = () => {
    onClose();
  };

  const contentNode = (
    <div className={styles["TryAgainPopup"]}>
      <div className={styles["TryAgainPopup-text"]}>{text}</div>
      <div
        className={styles["TryAgainPopup-btn"]}
        onClick={() => {
          onClose();
        }}
      >
        OK
      </div>
    </div>
  );

  return (
    <ModelBase
      visible={visiable}
      onClose={closeHanlde}
      title={"Retry"}
      contentNode={contentNode}
      hideCloseIcon={true}
      MainContainClass={styles.popup}
    />
  );
};

export default TryAgainPopup;
