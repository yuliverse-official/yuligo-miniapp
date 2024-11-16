import classNames from "classnames";
import styles from "./index.less";
import { useEffect, useRef, useState } from "react";
import yuligo_lyra from "@/assets/json/yuligo_lyra1.json";
import Lottie from "react-lottie";

declare global {
  interface Window {
    ShowLoading: () => void;
    HideLoading: () => void;
  }
}

const Loading: React.FC = () => {
  const [isShow, setIsShow] = useState(false);

  const [load_anim_ops, setLoadAnimOps] = useState({
    loop: true,
    autoplay: true,
    animationData: yuligo_lyra,
  });

  const Timer = useRef<any>(null);

  window.ShowLoading = () => {
    setIsShow(true);
    banScrolling();
  };

  window.HideLoading = () => {
    cancelScrolling();
    setIsShow(false);
  };

  const banScrolling = () => {
    document.body.style.overflow = "hidden";
  };

  const cancelScrolling = () => {
    document.body.style.overflow = "visible";
  };


  return (
    <div className={classNames(styles.loading, isShow ? styles["loading-show"] : "")}>
      <div className={styles.mask}>
        <div className={styles.lyra}>
          <Lottie options={load_anim_ops} height={88} width={88} isClickToPauseDisabled={true} />
        </div>
        <div className={styles["text"]}>loading...</div>
      </div>
    </div>
  );
};

export default Loading;
