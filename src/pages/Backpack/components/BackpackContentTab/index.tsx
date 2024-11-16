import { BACKPACK_TAB_ENUM } from "../../constants";
import styles from "./styles.less";
import classNames from "classnames";

export enum BACKPACK_CONTENT_TAB_SIZE {
  NORMAL = "normal",
  SMALL = "small",
}

interface tabItem {
  key: string;
  name: string;
  isLock?: boolean;
}

interface IBackpackContentTabProps {
  tabList: tabItem[];
  activeKey: string;
  size?: BACKPACK_CONTENT_TAB_SIZE;
  onClick?: (key: string) => void;
}

const BackpackContentTab: React.FC<IBackpackContentTabProps> = (props) => {
  const {
    tabList = [],
    activeKey,
    size = BACKPACK_CONTENT_TAB_SIZE.NORMAL,
    onClick,
  } = props;

  const handleTabClick = (item: tabItem) => {
    if (item?.isLock) {
      return;
    }

    onClick && onClick(item?.key);
  };

  return (
    <div
      className={classNames(styles["block-tab"], styles[`block-tab-${size}`])}
    >
      <div className={styles["tab-list"]}>
        {tabList.map((item, index) => {
          return (
            <div
              className={classNames(
                styles["tab-item"],
                activeKey === item?.key && styles["tab-item-active"],
                item?.isLock && styles["tab-item-lock"]
              )}
              key={index}
              onClick={() => handleTabClick(item)}
            >
              <div className={styles["tab-item-name"]}>{item?.name || ""}</div>
              {item?.isLock && (
                <div className={styles["tab-item-disable"]}>
                  <div className={styles["tab-item-disable-name"]}>
                    Cooming Soon
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BackpackContentTab;
