import classNames from "classnames";
import styles from "./index.less";
import { useEffect, useState } from "react";
import { getRoleOptions, getUserUnlockRoleList, postRoleGearUpgrade, postRoleSkillUpgrade } from "@/services/user";
import { MAX_SKILL_LEVEL, SpeedBoostItemType, SpeedBoostTabs } from "../../type";
import { NumberFormat } from "@/utils/format";
import Token_Go from "@/assets/images/common/coin/goods_icon_go.png";
import { useModel, history } from "@umijs/max";
import TonBackNode from "@/components/TonBackNode";
import { TOAST_TYPE } from "@/components/NewToast";

const SWITCH_GROUP = [
  {name: 'Skills', key: SpeedBoostTabs.Skill },
  {name: 'Gear', key: SpeedBoostTabs.Gear },
];

const Page = () => {
  const [curTab, setCurTab] = useState(SpeedBoostTabs.Skill);

  const { userInfo } = useModel('useUserInfoModel');
  const { UserAllRoles, useRoleType, isRequesting, updateRolesList } = useModel('rolesModel');
  const { UpdateTreasureHallGears } = useModel('treasureHallModel');
  const [curRoleData, setCurRoleData] = useState(UserAllRoles?.[useRoleType] || {});
  const [showList, setShowList] = useState<SpeedBoostItemType[]>(curRoleData?.[curTab] || []);
  const [isBuying, setBuying] = useState(false);

  const tagChangeHandle = (key: SpeedBoostTabs) => {
    if(curTab == key)return;
    setCurTab(key);
    setShowList(curRoleData?.[key] || []);
  }

  const pageInit = async () => {
    try {
      
    } catch (error) {
      console.log(error);
    }
  }

  const skillBuyHandle = async (item: SpeedBoostItemType) => {
    if(isBuying)return;
    setBuying(true);
    const role_id = curRoleData?.roleInfo?.role_id;
    if(Number(item?.cost) > Number(userInfo?.wallet_info?.token_go) || !(Number(userInfo?.wallet_info?.token_go) > 0)){
      window.ShowToast('Insufficient balance', TOAST_TYPE.Error, 3000);
      setTimeout(()=>{setBuying(false)}, 3000);
      return;
    }
    try {
      window.ShowLoading();
      const res = await postRoleSkillUpgrade({role_id, skill_id: item?.skill_id});
      console.log(res);
      updateRolesList();
    } catch (error) {
      console.log(error);
    }
    setBuying(false);
    window.HideLoading();
  }

  const gearBuyHandle = async (item: SpeedBoostItemType) => {
    if(isBuying)return;
    setBuying(true);
    const role_id = curRoleData?.roleInfo?.role_id;
    const { gear_id, cost_gear, gears_activated_count, cost } = item;
    // 余额判断
    if(Number(cost) > Number(userInfo?.wallet_info?.token_go) || !(Number(userInfo?.wallet_info?.token_go) > 0)){
      window.ShowToast('Insufficient balance', TOAST_TYPE.Error, 3000);
      setTimeout(()=>{setBuying(false)}, 3000);
      return;
    }
    // 消耗装备判断
    if(Number(cost_gear) > 0 && (Number(gears_activated_count) - 1) < Number(cost_gear)){
      window.ShowToast('Insufficient gears', TOAST_TYPE.Error, 3000);
      setTimeout(()=>{setBuying(false)}, 3000);
      return;
    }
    try {
      window.ShowLoading();
      const res = await postRoleGearUpgrade({role_id, gear_id});
      console.log(res);
      updateRolesList();
      UpdateTreasureHallGears();
    } catch (error) {
      console.log(error);
    }
    setTimeout(()=>{
      setBuying(false);
      window.HideLoading();
    }, 1000)
  };

  useEffect(()=>{
    pageInit();
  },[])

  useEffect(()=>{
    if(!!UserAllRoles){
      const curRole = UserAllRoles?.[useRoleType];
      setCurRoleData(curRole)
      setShowList(curRole?.[curTab]);
    }
  },[UserAllRoles, useRoleType])

  useEffect(()=>{
    if(isRequesting){
      window.ShowLoading();
    }else window.HideLoading();
  },[isRequesting])

  return <div className={styles.page}>
    <TonBackNode/>
    <div className={styles['switchView']}>
        {
            SWITCH_GROUP.map(item => {
                const { name, key } = item;
                return (
                    <div className={classNames(
                        styles['switchView-item'],
                        curTab == key && styles['active'],
                    )} key={key} onClick={()=>{
                        tagChangeHandle(key);
                    }}>
                        <div className={styles['text']}>{name}</div>
                    </div>
                )
            })
        }
    </div>
    <div className={styles['listView']}>
      {
        showList
        ?.sort((a, b) => a?.dex - b?.dex)
        ?.map((item, index) => {
          const { name, icon, speed, cost, level, gear_id, skill_id, gear_type, cost_gear, gear_max } = item;

          const isEquiped = curTab == SpeedBoostTabs.Gear && !!gear_id && `${gear_id}`?.length > 0;

          const isMaxLevel = isEquiped ? gear_max : Number(level) >= MAX_SKILL_LEVEL;
          const isNotAvail = !cost && !isMaxLevel;
          
          return (
            <div className={classNames(
              styles['listView-item'],
            )} onClick={()=>{
              if(!isEquiped && !!gear_type){
                history.push("/Backpack", {activeKey: gear_type});
              }
            }} key={index}>
              <div className={styles['listView-item-name']}>{name}</div>
              {
                (curTab == SpeedBoostTabs.Gear && isEquiped) &&
                <div className={styles['listView-item-level']}>
                  Lv.{level}
                </div>
              }
              <div className={styles['listView-item-speed']}>{`Boost\n${NumberFormat(speed)}/h`}</div>
              <img src={icon} className={classNames(
                styles['listView-item-icon'],
                isEquiped && styles['listView-item-iconEquiped'],
              )}/> 
              {
                curTab == SpeedBoostTabs.Skill
                ? <div className={classNames(
                  styles['listView-item-button'],
                  isMaxLevel && styles['max'],
                  isNotAvail && styles['ban'],
                )} onClick={()=>{
                  if(isMaxLevel || isNotAvail)return;
                  skillBuyHandle(item);
                }}>
                    {
                      isNotAvail 
                      ? 'No Data'
                      : (
                        isMaxLevel 
                        ? <div className={styles['buttonTextView']}>
                            <div className={styles['buttonTextView-level']}>Lv.{level}</div>
                            <div className={styles['buttonTextView-max']}>Max</div>
                          </div>
                        : <div className={styles['buttonTextView']}>
                            <div className={styles['buttonTextView-level']}>Lv.{Number(level) + 1}</div>
                            <div className={styles['buttonTextView-box']}>
                              <img src={Token_Go} className={styles['coin']}/>
                              {cost}
                            </div>
                          </div>
                      )
                    }
                  </div>
                  
                : <>
                  <div className={classNames(
                    styles['listView-item-button'],
                    styles['listView-item-button2'],
                    isNotAvail && styles['ban'],
                  )} onClick={()=>{
                    if(isMaxLevel || !isEquiped)return;
                    gearBuyHandle(item);
                  }}>
                    {
                      !isEquiped 
                      ? 'No Gear Equipped'
                      : (
                        isMaxLevel 
                        ? <div className={styles['buttonTextView']}>
                            <div className={styles['buttonTextView-max']}>Max</div>
                          </div>
                        : <div className={styles['buttonTextView']}>
                            {/* <div className={styles['buttonTextView-level']}>Lv.{level || 0}</div> */}
                            <div className={styles['buttonTextView-box']}>
                              {
                                !!cost_gear && cost_gear > 0 &&
                                <>
                                  <img src={icon} className={styles['prop']}/>
                                  {cost_gear}
                                </>
                              }
                            </div>
                            <div className={styles['buttonTextView-box']}>
                              
                              <img src={Token_Go} className={styles['coin']}/>
                              {NumberFormat(cost, 2)}
                            </div>
                          </div>
                      )
                    }
                  </div>
                  {
                    isEquiped &&
                    <img src={require('@/assets/images/SpeedBoost/icon_switch.png')} 
                    className={styles['listView-item-equipSwitch']} 
                    onClick={()=>{
                      history.push("/Backpack", {activeKey: gear_type});
                    }}/>
                  }
                </>
              }
            </div>
          )
        })
      }
    </div>
  </div>;
};

export default Page;
