import AppTabs from "@/components/AppTabs";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Outlet } from "umi";
import styles from "./index.less";
import { useTgAuth } from "@/hooks/useTgAuth";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import NewToast from "@/components/NewToast";
import { TonClientProvider } from "@/context/ton-client-context";

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
          <AppTabs />
        </TonClientProvider>
      </TonConnectUIProvider>
    </div>
  );
}
