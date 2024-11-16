import styles from "./index.less";
import { ReactNode, useState } from "react";
import ModelBase from "@/components/ModelBase";
import { CHECK_IN_DATA_TYPE, MISSION_CONDITIONS_TYPE, MissionId, MissionItemType, MissionStatus, MissionType, Mission_storge_tag, Mission_tag_type } from "../../type";
import classNames from "classnames";
import storage from "@/utils/storage";
import WebApp from "@twa-dev/sdk";
// import { useTonWalletHooks } from "@/hooks/useTonWalletHooks";
import { useModel, history } from "umi";
import { TAB_ENUM } from "@/components/AppTabs";
import YuliButton, { Button_State } from "@/components/YuliButton";
interface Iporps {
    visible: boolean;
    onClose: () => void;
    missionInfo: MissionItemType | null;
    onClaimHandle: (id: string) => void;
    checkInData: CHECK_IN_DATA_TYPE;
    refalshHandle: (id?: string) => void;
}

const MissionPopup: React.FC<Iporps> = (props) => {
    const { visible, onClose, missionInfo, onClaimHandle, checkInData, refalshHandle } = props;
    const { PageTurnTo } = useModel("menuStatus");
    const IsCheckInTaskType = missionInfo?.mission_type == MISSION_CONDITIONS_TYPE.Check_in;
    const [isPressOn, setPressOn] = useState(false);

    const MissonClickHandle = async () => {
        if(isPressOn)return;
        if(missionInfo?.status == MissionStatus.Claimed)return;
        if(missionInfo?.status == MissionStatus.Ing){
            const { extra, id } = missionInfo;
            let isDone = true;
            
            const handle = extra?.handle || {};
            if(handle?.type == Mission_tag_type.CLICK_BY_TG){
                if(WebApp?.platform.indexOf('tdesktop') > -1){
                    storage.set(Mission_storge_tag + id, isDone);
                }
                WebApp?.openTelegramLink && WebApp.openTelegramLink(handle?.url);
            }
            if(handle?.type == Mission_tag_type.CLICK){
                WebApp?.openLink && WebApp.openLink(handle?.url);
            }
            const delayTime = 24 * 1000;
            if(extra?.is_check_done){
                setTimeout(()=>{
                    storage.set(Mission_storge_tag + id, isDone);
                }, delayTime)
            }

            if(isDone){
                setPressOn(true);
                setTimeout(()=>{
                    refalshHandle && refalshHandle(missionInfo?.id);
                    setPressOn(false);
                }, delayTime + 100)
            } 
            // 1s后自动解除点击锁
            setTimeout(()=>{
                setPressOn(false);
            }, 1000)

            return;
        }
        if(missionInfo){
            onClaimHandle(missionInfo?.id);
        }
    }

    const CheckInClaimHandle = (info: any) => {
        const { isClaimed, claimAble } = info;
        if(isClaimed)return;
        if(claimAble){
            if(missionInfo){
                onClaimHandle(MissionId.CHECK_IN);
            }
        }
    }

    const ContentNode = (
        <div className={styles['contentView']}>
            <img className={styles['contentView-icon']} src={missionInfo?.taskIcon}/>
            <div className={styles['contentView-desc']}>
                {missionInfo?.taskDesc}
            </div>
        </div>
    )

    const FooterNode = (
        <div className={styles['footerView']}>
            <YuliButton 
                text={(
                    <div className={styles['innerText']}>
                        {
                            missionInfo?.status == MissionStatus.Claimed 
                            ? "Claimed"
                            : missionInfo?.status == MissionStatus.Claim 
                                ? "Claim"
                                : <>
                                    <img className={styles['icon']}
                                        src={missionInfo?.rewardCoin?.icon} />
                                    Get {missionInfo?.reward}
                                  </>
                        }
                    </div>
                )}
                buttonState={
                    missionInfo?.status === MissionStatus.Claimed 
                    ? Button_State.Ban
                    : Button_State.Default
                }
                onClick={MissonClickHandle}
                size="large"
            />
        </div>
    )

    const CheckIn_ContentNode = (
        <div className={styles['contentView']}>
           <img className={styles['contentView-checkInImg']} src={require("@/assets/images/Mission/role_img.png")}/>
        </div>
    );

    return (
        <ModelBase
            visible={visible}
            onClose={onClose}
            title={missionInfo?.taskName}
            titleNode={null}
            contentNode={IsCheckInTaskType ? CheckIn_ContentNode : ContentNode}
            footerNode={FooterNode}
            ContentClass={styles['TaskContent']}
            MainContainClass={IsCheckInTaskType ? styles['CheckInPopup'] : ''}
        />
    )
}

export default MissionPopup;