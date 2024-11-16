import { toUserFriendlyAddress, useTonAddress } from "@tonconnect/ui-react";
import { useTonConnect } from "./useTonConnect";
import { useEffect, useState } from "react";
import { useOKXConnect } from "./useOKXConnect";
import { getBindWallet } from "@/services/wallet";
import { useModel } from "@umijs/max";

export const useWalletConnect = () => {
  const { isLogin: isTgLogin } = useModel("useUserInfoModel");

  // ton Connect
  const tonAddress = useTonAddress(true);
  const { connected, walletAddress, device } = useTonConnect();

  // OKX Connect
  const { okxConnect, okxAddress, okxDevice } = useOKXConnect();

  const [isWalletConnect, setWalletConnect] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [userWalletDevice, setUserWalletDevice] = useState("");

  const handleGetBindAddress = async () => {
    const res = await getBindWallet();
    const address = res?.data?.address || "";
    return address;
  };

  const handleGetWallectConnectStatus = async () => {
    const _address = await handleGetBindAddress();
    if (_address) {
      setUserWalletAddress(_address);
      setWalletConnect(true);
      return;
    }

    const isConnect = connected || okxConnect;
    if (isConnect) {
      let _address = tonAddress;
      if (okxConnect) {
        if (!okxAddress || !okxAddress.includes(":")) return;
        const _okxAddress = await toUserFriendlyAddress(okxAddress);
        _address = _okxAddress;
      }
      setUserWalletAddress(_address || "");
      setUserWalletDevice(connected ? device : okxConnect ? okxDevice : "");
    } else {
      setUserWalletAddress("");
    }

    setWalletConnect(isConnect);
  };

  useEffect(() => {
    if (!isTgLogin) return;
    handleGetWallectConnectStatus();
  }, [connected, okxConnect, okxAddress, okxDevice, isTgLogin]);

  return {
    isWalletConnect,
    userWalletAddress,
    userWalletDevice,
  };
};
