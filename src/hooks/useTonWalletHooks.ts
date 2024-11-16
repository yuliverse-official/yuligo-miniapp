import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useModel } from "umi";
import { useEffect, useState } from "react";
const { REACT_APP_ENV } = process.env;

export function useTonWalletHooks() {
  const { TonWallet, setTonWallet, isConnected, setIsConnected } = useModel('tonWalletModel');
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const friendly_address = useTonAddress(true);
  
  useEffect(() => {

    if (wallet) {
      const address = wallet?.account?.address;
      if (address) {
        setTonWallet(friendly_address);
        setIsConnected(true);
      }
    }

  }, [wallet]);

  const handleTonWalletDisconnect = async () => {
    if (REACT_APP_ENV === "prod") {
      return;
    }
    await tonConnectUI.disconnect();
    setIsConnected(false);
  };

  const handleTonWalletConnect = async () => {
    const res = await tonConnectUI.openModal();
  };

  return {
    TonWallet,
    isConnected,
    handleTonWalletDisconnect,
    handleTonWalletConnect,
  };
};