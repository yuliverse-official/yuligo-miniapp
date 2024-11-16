import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Outlet } from "umi";
import styles from "./index.less";
import { useEffect, useState } from "react";
import storage from "@/utils/storage";
import WebApp from "@twa-dev/sdk";
import { useTgAuth } from "@/hooks/useTgAuth";
import Loading from "@/components/Loading";
import NewToast from "@/components/NewToast";
import { TonClientProvider } from "@/context/ton-client-context";
// import PolygonToast from "@/pages/sales/PolygonSecond/components/Toast";

const { manifestUrl } = process.env;

export default function Layout() {
  const { handleInitTgLoginState } = useTgAuth();

  useEffect(() => {
    handleInitTgLoginState();
  }, []);

  return (
    <div className={styles.page}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <TonClientProvider>
          <div className={styles.container}>
            <Outlet />
            <Loading />
            <NewToast />
          </div>
        </TonClientProvider>
      </TonConnectUIProvider>
    </div>
  );
}
