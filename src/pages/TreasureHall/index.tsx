import { useEffect, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import BackpackContentTab from "../Backpack/components/BackpackContentTab";
import { TREASURE_CONTENT_TAB_LIST, TREASURE_TAB_ENUM } from "./constants";
import TreasureHallItemList from "./components/TreasureHallItemList";
import TonBackNode from "@/components/TonBackNode";
import { useLocation } from "@umijs/max";
import MyHuntList from "./components/MyHuntList";
import CodexList from "./components/CodexList";

const TreasureHall: React.FC = (props) => {
  const location = useLocation();
  
  const [contentTabActiveKey, setContentTabAcitveKey] = useState<string>(
    TREASURE_TAB_ENUM.GEAR
  );

  const [TreasureHallitemKey, setTreasureHallItemKey] = useState("");

  const handleContentTabClick = (key: string) => {
    if (key === contentTabActiveKey) {
      return;
    }

    setContentTabAcitveKey(key);
  };

  useEffect(() => {
    const state: any = location?.state || {};
    const activeKey = state?.activeKey || "";
    setTreasureHallItemKey(activeKey);
  }, [location]);

  return (
    <div className={classNames(styles["pages"])}>
      <TonBackNode />
      <div className={classNames(styles["block-container"])}>
        <div className={styles["block-header"]}>
          <div className={styles["block-header-title"]}>Treasure Hall</div>
          <div className={styles["block-header-title-sub"]}>
            You can choose to sell it for Ton or activate it to boost CP and GO
            for richer airdrop rewards.
          </div>
          <div className={styles["block-content-tab"]}>
            <BackpackContentTab
              tabList={TREASURE_CONTENT_TAB_LIST}
              activeKey={contentTabActiveKey}
              onClick={handleContentTabClick}
            />
          </div>
        </div>

        <div className={styles["block-content-container"]}>
          {contentTabActiveKey === TREASURE_TAB_ENUM.GEAR && (
            <TreasureHallItemList itemKey={TreasureHallitemKey} />
          )}

          {contentTabActiveKey === TREASURE_TAB_ENUM.HUNT && <MyHuntList />}

          {contentTabActiveKey === TREASURE_TAB_ENUM.CODEX && <CodexList />}
        </div>
      </div>
    </div>
  );
};

export default TreasureHall;
