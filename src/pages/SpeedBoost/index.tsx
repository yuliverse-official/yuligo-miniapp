import style from "./index.less";
import Head from "./components/Head";
import List from  "./components/List";
import { useModel, KeepAlive, history } from "umi";
// @ts-ignore
import { TonConnectUIProvider } from "@tonconnect/ui-react";
const { manifestUrl } = process.env;

const Page = () => {
  return <div className={style.page}>
    <div className={style['page-main']}>
      <Head />
      <List />
    </div>
  </div>;
};

const KeepAlivePage: React.FC = () => {
  return (
    <KeepAlive
      name="Earn"
      when={() => {

        return history.action === "PUSH";
      }}
    >
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Page />
      </TonConnectUIProvider>
    </KeepAlive>
  );
};

export default KeepAlivePage;