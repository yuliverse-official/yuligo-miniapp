import { useTonConnect } from "@/hooks/useTonConnect";
import ModelBase from "../ModelBase";
import styles from "./styles.less";
import classNames from "classnames";
import WebApp from "@twa-dev/sdk";
import { useOKXConnect } from "@/hooks/useOKXConnect";
import { useEffect, useState } from "react";
const QRCode = require("qrcode");

interface IWalletConnectProps {
  isVisible: boolean;
  onClose: () => void;
}

const enum WALLET_TYPE {
  OKX = "OKX",
  TON = "TON",
}

const WALLET_SETTING = [
  {
    key: WALLET_TYPE.OKX,
    name: "OKX",
    icon: "logo_OKX@2x.png",
  },
  {
    key: WALLET_TYPE.TON,
    name: "Ton",
    icon: "logo_Ton@2x.png",
  },
];

declare global {
  // tslint:disable-next-line
  interface Window {
    hideWalletConnectPopup: () => void;
  }
}

const WalletConnect: React.FC<IWalletConnectProps> = (props) => {
  const { isVisible, onClose } = props;

  const { handleTonWalletConnect } = useTonConnect();
  const { handleOKXWalletConnect, okxConnect } = useOKXConnect();

  const [isGetUrl, setGetUrl] = useState(false);
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);
  const [qrcodeURL, setQRCodeURL] = useState("");

  const handleClose = () => {
    if (isGetUrl) return;
    onClose && onClose();
  };

  const handleQRCodeClose = () => {
    setQRCodeVisible(false);
    onClose && onClose();
  };

  const handleTonConnect = () => {
    handleTonWalletConnect();
    handleClose();
  };

  const handleOKXConnect = async () => {
    setGetUrl(true);
    const url = await handleOKXWalletConnect();
    if (!url) {
      setGetUrl(false);
      return;
    }

    const platform = WebApp.platform;
    if (platform === "tdesktop") {
      QRCode.toDataURL(url)
        .then((url: any) => {
          setQRCodeURL(url);
          setQRCodeVisible(true);
          setGetUrl(false);
        })
        .catch((err: any) => {
          console.error(err);
          setGetUrl(false);
        });
    } else {
      setGetUrl(false);
      WebApp.openLink(url, {
        try_instant_view: false,
      });
    }
  };

  const handleWalletClick = (item: any) => {
    if (isGetUrl) return;
    switch (item?.key) {
      case WALLET_TYPE.OKX:
        handleOKXConnect();
        break;
      case WALLET_TYPE.TON:
      default:
        handleTonConnect();
    }
  };

  useEffect(() => {
    if (okxConnect) {
      handleQRCodeClose();
    }
  }, [okxConnect]);

  window.hideWalletConnectPopup = () => {
    handleQRCodeClose();
  };

  const CONTENT_NODE = (
    <div className={styles["wallet-list"]}>
      {WALLET_SETTING.map((item, index) => {
        return (
          <div
            className={styles["wallet-item"]}
            key={index}
            onClick={() => handleWalletClick(item)}
          >
            <div className={styles["wallet-item-icon"]}>
              {item?.icon && (
                <img
                  src={require("@/assets/images/wallet/logo/" + item?.icon)}
                  draggable={false}
                />
              )}
            </div>
            <div className={styles["wallet-item-name"]}>
              {item?.name || ""} Connect
            </div>
          </div>
        );
      })}
    </div>
  );

  const QRCODE_CONTENT_NODE = (
    <div className={styles["qrcode"]}>
      {qrcodeURL && <img src={qrcodeURL} draggable={false} />}
    </div>
  );

  return (
    <>
      <ModelBase
        maskCloseEnable={false}
        visible={isVisible && !isQRCodeVisible}
        onClose={handleClose}
        title={"Connect Wallet"}
        contentNode={CONTENT_NODE}
        ContentClass={styles["content"]}
      />

      <ModelBase
        maskCloseEnable={false}
        visible={isQRCodeVisible}
        title={"Scan QR code with OKX  App"}
        onClose={handleQRCodeClose}
        contentNode={QRCODE_CONTENT_NODE}
        ContentClass={styles["content"]}
        HeaderClass={styles["header"]}
      />
    </>
  );
};

export default WalletConnect;
