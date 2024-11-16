import styles from "./styles.less";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { KeepAlive, useActivate, useLocation, useModel } from "@umijs/max";
import { NumberFormat } from "@/utils/format";
import BackpackContentTab from "./components/BackpackContentTab";
import { TOAST_TYPE } from "@/components/NewToast";
import { BACKPACK_TAB_ENUM, BACKPACK_CONTENT_TAB_LIST } from "./constants";
import ContentGear from "./components/ContentGear";
import BackpackCoin from "./components/BackpackCoin";
import CoinAccout from "../Mission/components/CoinAccout";
import { history } from "umi";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
const { manifestUrl } = process.env;

const Backpack: React.FC = () => {
  const location = useLocation();

  const [contentTabActiveKey, setContentTabAcitveKey] = useState<string>(
    BACKPACK_TAB_ENUM.GEAR
  );

  const [itemActiveKey, setItemActiveKey] = useState<any>("");

  const handleContentTabClick = (key: string) => {
    if (key === contentTabActiveKey) {
      return;
    }

    setContentTabAcitveKey(key);
  };

  const handleShowShop = (activeKey?: string) => {
    history.push("/****", { activeKey });

  };

  useEffect(() => {
    const state: any = location?.state || {};
    const activeKey = state?.activeKey || "";
    setItemActiveKey(activeKey);
  }, [location]);

  useEffect(() => {
    WebApp.BackButton.show();
  }, []);

  useActivate(() => {
    WebApp.BackButton.show();
  });

  return (
    <div className={styles["pages"]}>
      <div className={styles["container"]}>
        <div className={styles["block-header"]}>
          <div className={styles["block-header-name"]}>Item</div>
          <CoinAccout />
        </div>
        <div className={styles["block-content-tab"]}>
          <BackpackContentTab
            tabList={BACKPACK_CONTENT_TAB_LIST}
            activeKey={contentTabActiveKey}
            onClick={handleContentTabClick}
          />
        </div>
        <div className={styles["block-content-container"]}>
          {contentTabActiveKey === BACKPACK_TAB_ENUM.GEAR && (
            <ContentGear
              onClickShop={handleShowShop}
              activeKeyExternal={itemActiveKey}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// export default Backpack;

const KeepAlivePage: React.FC = () => {
  return (
    <KeepAlive
      name="Backpack"
      when={() => {
        // 根据路由的前进和后退状态去判断页面是否需要缓存，前进时缓存，后退时不缓存（卸载）
        // when中的代码是在页面离开（卸载）时触发的
        // true卸载时缓存，false卸载时不缓存
        WebApp.BackButton.hide();
        return history.action === "PUSH";
      }}
    >
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Backpack />
      </TonConnectUIProvider>
    </KeepAlive>
  );
};

export default KeepAlivePage;
