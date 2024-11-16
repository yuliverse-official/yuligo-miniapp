import styles from "./index.less";
import { useEffect, useState } from "react";
import { useModel, KeepAlive, history } from "umi";
import _ from "@umijs/utils/compiled/lodash";

// @ts-ignore
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import TonBackNode from "@/components/TonBackNode";
import WebApp from "@twa-dev/sdk";
import { useActivate } from "react-activation";
import { CheckInDaysGroup, Defalut_checkin_rewards } from "../MissionOptions";
import classNames from "classnames";
import YuliButton, { Button_State } from "@/components/YuliButton";
import { getCheckInList, getUserCheckInInfo } from "@/services/Mission/LoginReward";
import { deepCopy } from "@/utils/utils";
const { manifestUrl } = process.env;

const MISSION_TAG = 1;

const LoginReward: React.FC = () => {
  const { userInfo, updateUserInfoHanlde } = useModel('useUserInfoModel');
  const { missionList, checkInData, isRequesting, updateMissionList, getUnClaimedMission } = useModel("taskModel");
  const [ checkInDays, setCheckInDays] = useState(0);
  const [ checkInRewards, setCheckInRewards] = useState(Defalut_checkin_rewards);
  const [ checkInDaysGroup, setCheckInDaysGroup ] = useState(CheckInDaysGroup);
  const [ checkInBlockExpand, setCheckInBlockExpand] = useState(false);

  const pageInit = async () => {
    const res = await getCheckInList();
    const res2 = await getUserCheckInInfo();
    console.log(res2);
    
    const checkInDaysGroupLocal = deepCopy(checkInDaysGroup);
    const checkInRewardsLocal = deepCopy(checkInRewards);
    const daysGroupResData: number[] = res?.data?.BasicRewards || [];
    const propRewardResData: any[] = res?.data?.ConsecutiveRewards || [];
    if(daysGroupResData?.length > 0){
      daysGroupResData.map((v, d) => {
        console.log(v);
        checkInDaysGroupLocal[d].reward = v;
      })
    }
  }

  const checkInHandle = async (item: any) => {

  }

  const claimRewardHandle = async (item: any) => {

  }

  const itemClickHandle = (id: string) => {
    history.push("/Mission", { id });
}

  useEffect(()=>{
    if (isRequesting) {
      window.ShowLoading();
    } else {
      window.HideLoading();
    }
  },[isRequesting])

  useEffect(() => {
    WebApp.BackButton.show();
    pageInit();
  }, []);

  useActivate(() => {
    WebApp.BackButton.show();
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page-title']}>✦ Consecutive Login Reward ✦</div>
      <div className={styles['page-rewards']}>
        {
          checkInRewards?.map((item, index) => {
            const { days, icon, prop_name, status } = item;
            const claimState = checkInDays >= days && !status;
            return (
              <div className={classNames(
                styles['page-rewards-item'],
                claimState && styles['claim'],
                status && styles['claimed'],
              )} key={index} onClick={()=>{claimRewardHandle(item)}}>
                <div className={styles['days']}>
                  {days}
                  <span className={styles['sm']}>Days</span>
                </div>
                <img className={styles['prop']} src={icon}/>
                <div className={styles['name']}>{prop_name}</div>
                <div className={styles['bottomBox']}>
                  {
                    status 
                    ? <div className={styles['claimed']}>
                        <img src={require('@/assets/images/Mission/LoginReward/icon_yes.png')} />
                        Claimed
                      </div>
                    : (
                      claimState
                      ? <div className={styles['claimBtn']}>
                          <div className={styles['claimBtn-bg']}></div>
                          <div className={styles['claimBtn-main']}>Claim</div>
                        </div>
                      : <div className={styles['process']}>
                          <div className={styles['process-line']} style={{width: checkInDays > days ? '100%' : (checkInDays/days*100) + '%'}}></div>
                        </div>
                    )
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={classNames(
        styles['page-checkinTable'],
        checkInBlockExpand && styles['expand'],
      )}>
        <div className={styles['page-checkinTable-bg']}>
          <div className={styles['inner']}>
            <img className={styles['top']} src={require('@/assets/images/Mission/LoginReward/checkin_bg_top.png')} />
            <img className={styles['bottom']} src={require('@/assets/images/Mission/LoginReward/checkin_bg_bottom.png')} />
            <div className={styles['bottomView']}>
              <YuliButton
                text={'Continue'}
                buttonState={Button_State.Black}
                onClick={()=>{checkInHandle(1)}}
                buttonCss={styles['bottomView-btn']}
                size="large"
              />
              <div className={styles['bottomView-control']} 
                onClick={()=>setCheckInBlockExpand(!checkInBlockExpand)}>
                <img className={classNames(
                  styles['down'],
                  checkInBlockExpand && styles['up'],
                )}
                src={require('@/assets/images/Mission/LoginReward/icon_arrow_down.png')} />
                {checkInBlockExpand ? 'folding' : 'launched'}
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(
          styles['page-checkinTable-main'],
          checkInBlockExpand && styles['expand'],
        )}>
          {
            checkInDaysGroup?.map((item, index) => {
              const { reward, isEnd, isClaim, isOver } = item;
              const maxDays = 14;
              const theNewDay = checkInDaysGroup?.findIndex(i => !i?.isOver) + 1;
              
              const claimState = isClaim;
              const overState = !claimState && isOver && !isEnd;

              const rowNumber = 5;
              const days = index + 1;

              const rowDex = Math.ceil(days / rowNumber);
              const showDex = Math.ceil(theNewDay / rowNumber);

              const isHide = !checkInBlockExpand && rowDex !== showDex;
              return (
                <div className={classNames(
                    styles['page-checkinTable-main-item'],
                    claimState && styles['claimed'],
                    overState && styles['over'],
                    isEnd && styles['end'],
                    isHide && styles['hide'],
                  )}  
                  key={days}>
                  {
                    !isEnd && 
                    <>
                      {claimState && <img className={styles['tag']} src={require('@/assets/images/Mission/LoginReward/icon_yes.png')} />}
                      {overState && <img className={styles['tag']} src={require('@/assets/images/Mission/LoginReward/icon_no.png')} />}
                      <img className={styles['prop']} src={require('@/assets/images/common/coin/goods_icon_go.png')} />
                      <div className={styles['value']}>{reward}</div>
                    </>
                  }
                  <div className={styles['bottomText']}>
                    {
                      isEnd 
                      ? 'End'
                      : `${days}${days == 1 ? 'st' : (days == 2 ? 'nd' : (days == 3 ? 'rd' : 'th'))} Day`
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={styles['page-title']}>✦ Newly Recommended Task ✦</div>
      <div className={styles['page-list']}>
        {
          getUnClaimedMission()?.map((item, index) => {
              return (
                  <div className={styles['taskItem']} key={index} onClick={()=>itemClickHandle(item.id)}>
                      <div className={styles['taskItem-left']}>
                          <img src={item.taskIcon} className={styles['icon']}/>
                          <div className={styles['label']}>{item.taskName}</div>
                      </div>
                      <div className={styles['taskItem-right']}>
                          <div className={styles['rewardView']}>
                              <span>{item.reward}</span>
                              <img className={styles['coin']} src={item?.rewardCoin?.icon}/>
                          </div>
                      </div>
                  </div>
              )
          })
        }
      </div>
    </div>
  );
};

const KeepAlivePage: React.FC = () => {
  return (
    <KeepAlive
      name="LoginReward"
      when={() => {
        WebApp.BackButton.hide();
        return history.action === "PUSH";
      }}
    >
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <LoginReward />
      </TonConnectUIProvider>
    </KeepAlive>
  );
};

export default KeepAlivePage;

