import styles from "./index.less";
import logo from "@/assets/images/common/yuligo_logo_black.png";

interface Iprops {
  progress?: number;
}

const LoadCom: React.FC<Iprops> = (props) => {
  const { progress = 0 } = props;

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={styles.bottom}>
        <div className={styles.text}>{progress}%</div>
        <div className={styles.progress}>
          <div className={styles["progress-bar"]} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadCom;
