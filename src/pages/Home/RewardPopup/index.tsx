import { useModel } from "@umijs/max";
import styles from "./index.less";
import ModelBase from "@/components/ModelBase";

interface Iporps {
  text: string;
  onClose: () => void;
  visiable: boolean;
}

const RewardPopup: React.FC<Iporps> = (props) => {
  const { text, visiable, onClose } = props;
  const closeHanlde = () => {
    onClose();
  };
  const { userInfo, updateUserInfoHanlde } = useModel("useUserInfoModel");

  const contentNode = (
    <div className={styles["RewardPopup"]}>
      <img
        className={styles["RewardPopup-icon"]}
        src={require("@/assets/images/common/coin/goods_icon_go.png")}
        alt=""
      />
      <div className={styles["RewardPopup-text"]}>
        {text}
        {Number(userInfo?.treasure_mark_buff) > 0 && (
          <span className={styles["RewardPopup-text-buff"]}>x {userInfo?.treasure_mark_buff} </span>
        )}
        Miles Point
      </div>
    </div>
  );

  return (
    <ModelBase
      visible={visiable}
      onClose={closeHanlde}
      title={"REWARD"}
      contentNode={contentNode}
      hideCloseIcon={false}
      MainContainClass={styles.popup}
    />
  );
};

export default RewardPopup;
