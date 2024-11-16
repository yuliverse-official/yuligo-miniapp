import { Mask } from "antd-mobile";
import styles from "./index.less";
import { ReactNode } from "react";
import classNames from "classnames";

interface Iporps {
  visible: boolean;
  onClose: () => void;
  title?: ReactNode;
  titleNode?: ReactNode;
  contentNode?: ReactNode;
  footerNode?: ReactNode;
  maskCloseEnable?: boolean;
  hideCloseIcon?: boolean;
  ContentClass?: string;
  MainContainClass?: string;
  footerClass?: string;
  opacity?: number;
  zIndex?: number;
  HeaderClass?: string;
}

/** 基础弹窗*/
const ModelBase: React.FC<Iporps> = (props) => {
  const {
    visible,
    onClose,
    title,
    titleNode,
    contentNode,
    footerNode,
    maskCloseEnable = true,
    hideCloseIcon,
    HeaderClass,
    ContentClass,
    MainContainClass,
    footerClass,
    opacity = 0.6,
    zIndex = 1000,
  } = props;

  return (
    <Mask
      visible={visible}
      style={{
        background: `rgba(0,0,0,${opacity})`,
        zIndex: zIndex,
      }}
      onMaskClick={() => {
        if (!maskCloseEnable) return;
        onClose && onClose();
      }}
    >
      <div className={classNames(styles["contain"], MainContainClass)}>
        <div className={styles["contain-top-bg"]}></div>
        <div className={styles["contain-bottom-bg"]}></div>
        {!titleNode ? (
          <div className={classNames(styles["contain-titleView"], HeaderClass)}>
            <div className={styles["contain-titleView-title"]}>{title}</div>
            {!hideCloseIcon && (
              <img
                onClick={() => {
                  onClose && onClose();
                }}
                className={styles["contain-titleView-close"]}
                src={require("@/assets/images/common/popup/icon_close@2x.png")}
                draggable={false}
              />
            )}
          </div>
        ) : (
          titleNode
        )}
        <div className={classNames(styles["contain-content"], ContentClass) }>{contentNode}</div>
        <div className={classNames(styles["contain-footer"], footerClass)}>{footerNode}</div>
      </div>
    </Mask>
  );
};

export default ModelBase;
