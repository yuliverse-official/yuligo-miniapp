import { useEffect, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import UserBindEmailPopup from "./components/UserBindEmailPopup";
import { useModel } from "@umijs/max";
import { NumberFormat } from "@/utils/format";
import WebApp from "@twa-dev/sdk";
import WalletConnect from "@/components/WalletConnect";
import { useTonConnect } from "@/hooks/useTonConnect";
import { getBindWallet } from "@/services/wallet";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useOKXConnect } from "@/hooks/useOKXConnect";

const Account: React.FC = () => {
  const { updateMissionList } = useModel("taskModel");
  const { userInfo, updateUserInfoHanlde } = useModel("useUserInfoModel");
  const { isWalletConnect, userWalletAddress, userWalletDevice } =
    useWalletConnect();

  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isBindUserEmail, setBindUserEmail] = useState(false);

  const [userYuliGo, setUserYuliGo] = useState("0");

  const [userCP, setUserCP] = useState(0);

  const [isUserBindEmailPopupShow, setUserBindEmailPopupShow] = useState(false);
  const { handleDisconnect } = useTonConnect();
  const { handleOKXWalletDisConnect } = useOKXConnect();
  const [isUserBindWallet, setUserBindWallet] = useState(false);
  const [userAddress, setWalletAddress] = useState("");
  const [isUserBindWalletPopupShow, setUserBindWalletPopupShow] =
    useState(false);

  const handleSetUserInfo = () => {
    const username = userInfo?.username || "Unknown";
    const photo_url = userInfo?.photo_url || "";
    const email = userInfo?.email || "";

    const wallet_info = userInfo?.wallet_info || null;
    const token_go = wallet_info?.token_go || "0";

    const collection_points = userInfo?.collection_points || 0;

    setUserName(username);
    setUserAvatar(photo_url);
    setUserEmail(email);
    setUserYuliGo(token_go);
    setUserCP(collection_points);
  };

  const handleUserBindEmailPopupShow = () => {
    setUserBindEmailPopupShow(true);
  };

  const handleUserBindEmailPopupClose = () => {
    setUserBindEmailPopupShow(false);
  };

  const handleUserBindWalletPopupShow = () => {
    setUserBindWalletPopupShow(true);
  };

  const handleUserBindWalletPopupClose = () => {
    setUserBindWalletPopupShow(false);
  };

  const handleEmailBind = (email: string) => {
    setUserEmail(email);

    updateUserInfoHanlde();
  };

  const handleTransAccount = (account: string | undefined) => {
    if (account) {
      const prefix = account.substring(0, 5);
      const suffix = account.substring(account.length - 5);
      const formattedAccount = `${prefix}...${suffix}`;
      return formattedAccount;
    } else {
      return "";
    }
  };

  const handleRefresh = async () => {
    window.ShowLoading();
    await updateUserInfoHanlde().finally(() => window.HideLoading());
  };

  const handleUnBind = async () => {
    return;
    handleDisconnect();
    handleOKXWalletDisConnect();
  };

  const handleGetBindAddress = async () => {
    const res = await getBindWallet();
    const address = res?.data?.address || "";
    if (address) {
      setUserBindWallet(true);
      setWalletAddress(address);
    }
  };

  useEffect(() => {
    handleSetUserInfo();
  }, [userInfo]);

  useEffect(() => {
    setBindUserEmail(!!userEmail);
  }, [userEmail]);

  useEffect(() => {

  }, []);

  useEffect(() => {
    setUserBindWallet(isWalletConnect);
    setWalletAddress(userWalletAddress);
    if (isWalletConnect) {
      updateMissionList();
    }
  }, [isWalletConnect]);

  return (
    <div className={styles["page"]}>
      <div className={styles["block-info-account"]}>
        <div className={styles["block-info-account-container"]}>
          <div className={styles["account-info-icon"]}>
            {userAvatar ? (
              <img src={userAvatar} draggable={false} />
            ) : (
              <img
                src={require("@/assets/images/common/avatar/default_user_avatar.png")}
                draggable={false}
              />
            )}
          </div>
          <div className={styles["account-info-list"]}>
            <div className={styles["account-info-username"]}>{userName}</div>

            <div className={styles["account-info-wrap"]}>
              <div className={styles["account-info-wrap-name"]}>Email:</div>
              {isBindUserEmail ? (
                <div className={styles["account-info-email"]}>{userEmail}</div>
              ) : (
                <div
                  className={styles["account-info-email-nobind"]}
                  onClick={handleUserBindEmailPopupShow}
                >
                  <div className={styles["account-info-email-nobind-text"]}>
                    Bind Email
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        <div
          className={classNames(
            styles["block-info-score-container"],
            styles["block-info-score-container-cp"]
          )}
        >
          <div className={classNames(styles["block-info-score-list"])}>
            <div className={styles["info-score-icon"]}></div>
            <div className={styles["info-score-name"]}>Collection Points</div>
          </div>
          <div className={styles["info-score-score"]}>
            {NumberFormat(Number(userCP))}
          </div>
        </div>
        <div className={styles["block-info-score-container"]}>
          <div className={styles["block-info-score-list"]}>
            <div className={styles["info-score-icon"]}></div>
            <div className={styles["info-score-name"]}>YuliGO</div>
          </div>
          <div className={styles["info-score-score"]}>
            {NumberFormat(Number(userYuliGo))}
          </div>
        </div>
        <div className={styles["block-info-wallet-container"]}>
          {isUserBindWallet ? (
            <>
              <div
                className={styles["account-info-wallet"]}
                onClick={handleUnBind}
              >
                {handleTransAccount(userAddress)}
              </div>
              <div className={styles["account-info-wallet-icon"]}></div>
            </>
          ) : (
            <>
              <div
                className={styles["account-info-wallet-nobind"]}
                onClick={handleUserBindWalletPopupShow}
              >
                Connect Wallet
              </div>
              <div className={styles["account-info-wallet-icon-nobind"]}></div>
            </>
          )}
        </div>
      </div>

      <div className={styles["block-info-merchant"]}>
        <div className={styles["merchant-title"]}>
          Apply to Join YuliGO as a Merchant
        </div>
        <div className={styles["merchant-decription"]}>
          Send a message to YuliGo's BD Assistant to contact us about becoming a
          YuliGo merchant.
        </div>
        <div
          className={classNames(
            styles["merchant-btn"],
            styles["merchant-btn-disable"]
          )}
        >
          <div className={styles["merchant-btn-text"]}>Coming soon</div>
        </div>
      </div>

      <UserBindEmailPopup
        isVisible={isUserBindEmailPopupShow}
        onClose={handleUserBindEmailPopupClose}
        onBind={handleEmailBind}
      />

      <WalletConnect
        isVisible={isUserBindWalletPopupShow}
        onClose={handleUserBindWalletPopupClose}
      />
    </div>
  );
};

export default Account;
