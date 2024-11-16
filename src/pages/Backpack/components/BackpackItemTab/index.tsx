import { BACKPACK_ITEM_TAB_ENUM } from "../../constants";
import styles from "./styles.less";
import classNames from "classnames";

interface tabItem {
  key: BACKPACK_ITEM_TAB_ENUM;
  name: string;
  isLock?: boolean;
}

interface IBackpackItemTabProps {
  tabList: tabItem[];
  activeKey: string;
  onClick?: (key: BACKPACK_ITEM_TAB_ENUM) => void;
}

const BackpackItemTab: React.FC<IBackpackItemTabProps> = (props) => {
  const { tabList = [], activeKey, onClick } = props;

  const handleTabClick = (item: tabItem) => {
    if (item?.isLock) {
      return;
    }

    onClick && onClick(item?.key);
  };

  return (
    <div className={styles["block-tab"]}>
      <div className={styles["tab-list"]}>
        {tabList.map((item, index) => {
          return (
            <div
              className={classNames(
                styles["tab-item"],
                activeKey === item?.key && styles["tab-item-active"]
              )}
              key={index}
              onClick={() => handleTabClick(item)}
            >
              <div className={styles["tab-item-name"]}>{item?.name || ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BackpackItemTab;
