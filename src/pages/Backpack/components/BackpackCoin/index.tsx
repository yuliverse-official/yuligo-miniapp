import { NumberFormat } from "@/utils/format";
import styles from "./styles.less";
import classNames from "classnames";
import { useModel } from "@umijs/max";
import { useEffect, useState } from "react";

const BackpackCoin: React.FC = () => {
  const { userInfo, updateUserInfoHanlde } = useModel("useUserInfoModel");
  const [userYuliGo, setUserYuliGo] = useState("0");

  const handleSetUserInfo = () => {
    const wallet_info = userInfo?.wallet_info || null;
    const token_go = wallet_info?.token_go || "0";
    setUserYuliGo(token_go);
  };

  useEffect(() => {
    handleSetUserInfo();
  }, []);

  return (
    <div className={styles["block-header-coin"]}>
      <div className={styles["block-coin"]}>
        <div className={styles["coin-icon"]}></div>
        <div className={styles["coin-value"]}>
          {NumberFormat(Number(userYuliGo))}
        </div>
      </div>
    </div>
  );
};

export default BackpackCoin;
