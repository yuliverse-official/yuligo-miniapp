import CoinAccout from "@/pages/Mission/components/CoinAccout";
import style from "./index.less";
import { useEffect, useState } from "react";
import { NumberFormat } from "@/utils/format";
import { useModel } from "@umijs/max";
import { RoleInfoType } from "@/models/rolesModel";

const Page = () => {
  const { UserAllRoles, useRoleType, getRoleInfoByRoleType } = useModel('rolesModel');
  const [curRoleData, setCurRoleData] = useState<RoleInfoType | null>(null);

  const init = async () => {
    const role = await getRoleInfoByRoleType(useRoleType);
    setCurRoleData(role);
  }

  useEffect(()=>{
    
    if(!!UserAllRoles){
      init();
    }
  },[UserAllRoles, useRoleType])

  useEffect(()=>{
    init();
  },[])
  
  return <div className={style.page}>
    <div className={style['page-main']}>
      <div className={style['page-main-account']}>
        <CoinAccout />
      </div>
      <div className={style['page-main-level']}>
        Lv.{curRoleData?.level}
      </div>
      <div className={style['page-main-speed']}>
        {curRoleData?.speedPerMin ? NumberFormat(curRoleData?.speedPerMin, 1): 0}/Min
      </div>
      <div className={style['page-main-progress']}>
        {
          ['1'].map(i => {
            const useCur = curRoleData?.cur || 0;
            const useNext = curRoleData?.next || 1;
            const process = (useCur / useNext) * 100;
            return (
              <div key={i} className={style['process']} style={{width: (process > 100 ? 100 : process) + '%'}}></div>
            )
          })
        }
      </div>
    </div>
  </div>;
};

export default Page;
