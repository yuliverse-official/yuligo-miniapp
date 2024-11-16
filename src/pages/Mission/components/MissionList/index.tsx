import { useEffect, useState } from "react";
import { CHECK_IN_DATA_TYPE, MISSION_API_TAG_TYPE, MissionItemType } from "../../type";
import MissionItem from "../MissionItem";
import styles from "./index.less";
import MissionPopup from "../MissionPopup";
import { postMissionClaim } from "@/services/Mission";
import { useLocation } from "umi";
import classNames from "classnames";
import { useModel } from "umi";
import { MissionOptions } from "../../MissionOptions";
import Referral, { SwitchKey } from "../Referral";
import { TOAST_TYPE } from "@/components/NewToast";
import { getInviteList } from "@/services/referral";
import { deepCopy } from "@/utils/utils";
import { getAllTableData } from "@/utils/apiUtils";
interface Iporps {
    list: MissionItemType[]
    checkInData: CHECK_IN_DATA_TYPE;
    reflashHandle: (id?: string) => void;
    isRequesting: boolean;
}

const SWITCH_GROUP = [
    {name: 'YuliGO Task', key: MISSION_API_TAG_TYPE.Tab1 },
    {name: 'Partnership', key: MISSION_API_TAG_TYPE.Tab2 },
    {name: 'Referral', key: MISSION_API_TAG_TYPE.Tab3 },
];

const MissionList: React.FC<Iporps> = (props) => {
    const { list, checkInData, reflashHandle, isRequesting } = props;
    const [isShowPopup, setShowPopup] = useState(false);
    const [curMission, setCurMission] = useState<MissionItemType | null>(null);
    const { curMissionTag, tagChangeHandle } = useModel("taskModel");
    const [isClaiming, setClaiming] = useState(false);
    const location = useLocation();

    const [friendList, setFriendList] = useState({
        [SwitchKey.Tab1]: {
          data: [],
          total: 0,
          isUpdate: false,
        },
        [SwitchKey.Tab2]: {
          data: [],
          total: 0,
          isUpdate: false,
        },
    });
    const [ReferRequesting, setReferRequesting] = useState(false);
    const [ReferGetCoinTotal, setReferGetCoinTotal] = useState(0);
    const getListData = async () => {
        setReferRequesting(true);
        try {
            const friendListLocal = deepCopy(friendList);
            
            let res: any = {};
            const resBond = await getInviteList({page: 1, page_size: 20, query_type: SwitchKey.Tab1});
            // console.log("getInviteList: ", res);
            const data: any[] = resBond?.data || [];
            const { normal_score, premium_score } = resBond;
            const countTotal = Number(normal_score) + Number(premium_score);
            setReferGetCoinTotal(countTotal);
            res = resBond
            // @ts-ignore
            const resTab1: never[] = await getAllTableData(1, 100, [], getInviteList, {query_type: SwitchKey.Tab1});
            friendListLocal[SwitchKey.Tab1].data = resTab1;
            friendListLocal[SwitchKey.Tab1].isUpdate = true;
            friendListLocal[SwitchKey.Tab1].total = resTab1?.length;
            // @ts-ignore
            const resTab2: never[] = await getAllTableData(1, 100, [], getInviteList, {query_type: SwitchKey.Tab2});
            friendListLocal[SwitchKey.Tab2].data = resTab2;
            friendListLocal[SwitchKey.Tab2].isUpdate = true;
            friendListLocal[SwitchKey.Tab2].total = resTab2?.length;
            setFriendList(friendListLocal);
        console.log("friendListLocal:  ",  friendListLocal);
        
            setReferRequesting(false);
            return res;
        } catch (error) {
            console.error(error);
        }
    }
    
    const popCloseHandle = () => {
        setShowPopup(false);
        // setCurMission(null);
    }

    const MissionOnclickHandle = (info: MissionItemType) => {
        setCurMission(info);
        setShowPopup(true);
    }

    const MissionClaimHandle = async (id: string) => {
        if(isClaiming)return;
        try {
            window.ShowLoading();
            setClaiming(true);
            const res = await postMissionClaim({id});
            // console.log(res);
            window.HideLoading();
            window.ShowToast("Claim Successfully.", TOAST_TYPE.Success, 2000);
            setTimeout(()=>{
                reflashHandle && reflashHandle(id);
                setShowPopup(false);
            },600)
        } catch (error) {
            console.error(error);
            window.HideLoading();
            window.ShowToast("Network Error.", TOAST_TYPE.Error, 2000);
        }
        setClaiming(false);
    }

    useEffect(()=>{
        if(!isRequesting && !!curMission){
            const newMission = list?.find(i => i.id == curMission?.id);
            if(!!newMission){
                setCurMission(newMission);
            }
        }
    },[isRequesting])

    useEffect(()=>{
        const state: any = location?.state || {};
        const id = state?.id;
        if(id){
            const idMission = list.find(i => i.id == id);
            if(!!idMission){
                setCurMission(idMission);
                setShowPopup(true);
                tagChangeHandle(idMission?.mission_module);
            }
            return;
        }
        const tab: MISSION_API_TAG_TYPE = state?.tab;
        if(tab){
            tagChangeHandle(tab);
        }
    },[location])

    useEffect(()=>{
        getListData();
    },[])

    const curList = list.filter(i => i.mission_module == curMissionTag);

    return (
        <div className={styles['page']}>
            <div className={styles['page-titleView']}>
                <div className={styles['switchView']}>
                    {
                        SWITCH_GROUP.map(item => {
                            const { name, key } = item;
                            return (
                                <div className={classNames(
                                    styles['switchView-item'],
                                    curMissionTag == key && styles['active'],
                                )} key={key} onClick={()=>{
                                    if(curMissionTag == key)return;
                                    tagChangeHandle(key);
                                }}>
                                    <div className={styles['text']}>{name}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                curMissionTag !== MISSION_API_TAG_TYPE.Tab3 
                ? <div className={styles['page-missionList']}>
                    {
                        curList?.length > 0 
                        ?   <>
                                {
                                    curList.map((item, index)=>{
                                        return (
                                            <MissionItem 
                                                onItemTouch={MissionOnclickHandle} 
                                                missionInfo={item} 
                                                key={index}/>
                                        )
                                    })
                                }
                            </>
                        :   <div className={styles['page-missionList-nodata']}>
                                <img className={styles['icon']} src={require("@/assets/images/Mission/role_img.png")} />
                                No tasks yet
                            </div>
                    }
                </div>
                : <Referral friendList={friendList} 
                            isReferRequesting={ReferRequesting} 
                            ReferGetCoinTotal={ReferGetCoinTotal}/>
            }
            <MissionPopup 
                checkInData={checkInData} 
                onClaimHandle={MissionClaimHandle} 
                onClose={popCloseHandle}
                refalshHandle={reflashHandle}
                visible={isShowPopup} 
                missionInfo={curMission} 
            />
        </div>
    )
}

export default MissionList;