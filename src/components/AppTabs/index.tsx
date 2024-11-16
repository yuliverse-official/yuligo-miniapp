import className from "classnames";
import { useEffect, useState } from "react";
import { history } from "umi";
import styles from "./index.less";
import { useModel } from "umi";
import classNames from "classnames";

export const enum TAB_ENUM {
  Mine = "Going",
  Merchant = "Merchant",
  Account = "Account",
  Hunt = "Hunt",
}

const TABS = [
  {
    icon: require("@/assets/images/home/tabs/icon_going_off.png"),
    iconActive: require("@/assets/images/home/tabs/icon_going_on.png"),
    name: "Going",
    key: TAB_ENUM.Mine,
    link: "/Home",
  },
  {
    icon: require("@/assets/images/home/tabs/icon_hunt_off.png"),
    iconActive: require("@/assets/images/home/tabs/icon_hunt_on.png"),
    name: "Hunt",
    key: TAB_ENUM.Hunt,
    link: "/Hunt",
  },
  {
    icon: require("@/assets/images/home/tabs/icon_merchant_off.png"),
    iconActive: require("@/assets/images/home/tabs/icon_merchant_on.png"),
    name: "Merchant",
    key: TAB_ENUM.Merchant,
    link: "/Merchant",
  },
  {
    icon: require("@/assets/images/home/tabs/icon_account_off.png"),
    iconActive: require("@/assets/images/home/tabs/icon_account_on.png"),
    name: "Account",
    key: TAB_ENUM.Account,
    link: "/Account",
  },
];

const AppTabs: React.FC = () => {
  const pathName = location?.pathname;
  const { backNum, setBackNum } = useModel("menuStatus");
  /**
   * 切换tab
   * @param num
   */
  const changeBackStyle = (tab: TAB_ENUM, link: string) => {
    if (tab === backNum || tab === TAB_ENUM.Merchant) {
      return;
    }
    history.push(link);
    setBackNum(tab);
  };


  const getPathName = () => {
    const item = [...TABS].filter((item) => {
      return item.link === pathName;
    });
    const key = item[0]?.key || TAB_ENUM.Mine;
    return key;
  };


  useEffect(() => {
    const tab = getPathName();

    setBackNum(tab);
  }, [pathName]);

  return (
    <div className={styles.content}>
      <div className={styles.tabs}>
        {TABS.map((item, index) => {
          const { key, link, icon, iconActive, name } = item;
          return (
            <div
              className={className(styles["tabs-item"], backNum === key && styles.active)}
              onClick={() => {
                changeBackStyle(key, link);
              }}
              key={index}
            >
              {key === TAB_ENUM.Merchant && (
                <div className={styles["tabs-item-coming"]}>Coming Soon</div>
              )}
              <div
                className={classNames(
                  styles["tabs-item-icon"],
                  styles[`tabs-item-icon-${key}`],
                  backNum === key && styles[`tabs-item-icon-${key}-active`]
                )}
              ></div>
              <div className={styles["tabs-item-name"]}>{name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppTabs;
