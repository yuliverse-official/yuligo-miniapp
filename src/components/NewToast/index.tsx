import classNames from "classnames";
import styles from "./index.less";
import { useEffect, useRef, useState } from "react";

export enum TOAST_TYPE {
  Success = "Success",
  Error = "Error",
  Warn = "Warn",
}

declare global {
  interface Window {
    ShowToast: (msg: string, type?: TOAST_TYPE, time?: number) => void;
    HideToast: () => void;
  }
}

const NewToast: React.FC = () => {
  const [isShow, setIsShow] = useState(false);
  const [curToastType, setToastType] = useState(TOAST_TYPE.Success);
  const [showMsg, setShowMsg] = useState("");
  const Timer = useRef<any>(null);

  window.ShowToast = (msg: string, type?: TOAST_TYPE, time?: number) => {
    setShowMsg(msg);
    if (type) {
      setToastType(type);
    }
    if (time && time > 0) {
      Timer.current = setTimeout(() => {
        setIsShow(false);
      }, time);
    }
    setIsShow(true);
  };

  window.HideToast = () => {
    setIsShow(false);
    clearTimeout(Timer.current);
  };

  return (
    <div
      className={classNames(
        styles.newToast,
        isShow ? styles["newToast-show"] : ""
      )}
    >
      <div className={styles.mask}>
        <div
          className={classNames(
            styles["bg"],
            curToastType == TOAST_TYPE.Success && styles["bg-success"],
            curToastType == TOAST_TYPE.Error && styles["bg-error"],
            curToastType == TOAST_TYPE.Warn && styles["bg-warn"]
          )}
        >
          <div className={styles["block"]}>
            <div className={styles["icon"]}></div>
            <div className={styles["text"]}>{showMsg}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewToast;
