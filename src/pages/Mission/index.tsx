import styles from "./index.less";
import { useEffect, useState } from "react";
import MissionList from "./components/MissionList";
import { useModel, KeepAlive, history } from "umi";
import _ from "@umijs/utils/compiled/lodash";

// @ts-ignore
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import TonBackNode from "@/components/TonBackNode";
import CoinAccout from "./components/CoinAccout";
import WebApp from "@twa-dev/sdk";
import { useActivate } from "react-activation";
const { manifestUrl } = process.env;

const MISSION_TAG = 1;

const Earn: React.FC = () => {
  const { userInfo, updateUserInfoHanlde } = useModel('useUserInfoModel');
  
  const { missionList, checkInData, isRequesting, updateMissionList } = useModel("taskModel");

  useEffect(()=>{
    if (isRequesting) {
      window.ShowLoading();
    } else {
      window.HideLoading();
    }
  },[isRequesting])

  useEffect(() => {
    WebApp.BackButton.show();
  }, []);

  useActivate(() => {
    WebApp.BackButton.show();
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page-main']}>
        {/* <TonBackNode /> */}
        <div className={styles['page-main-head']}>
          <div className={styles['title']}>Go Task</div>
          <CoinAccout />
        </div>
        <MissionList 
          reflashHandle={updateMissionList} 
          list={missionList} 
          isRequesting={isRequesting}
          checkInData={checkInData}/>
      </div>
    </div>
  );
};

const KeepAlivePage: React.FC = () => {
  return (
    <KeepAlive
      name="Earn"
      when={() => {
        // 根据路由的前进和后退状态去判断页面是否需要缓存，前进时缓存，后退时不缓存（卸载）
        // when中的代码是在页面离开（卸载）时触发的
        // true卸载时缓存，false卸载时不缓存
        WebApp.BackButton.hide();
        return history.action === "PUSH";
      }}
    >
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Earn />
      </TonConnectUIProvider>
    </KeepAlive>
  );
};

export default KeepAlivePage;
// export default Earn;
