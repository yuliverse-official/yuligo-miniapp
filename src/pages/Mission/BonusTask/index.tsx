import { Mask } from "antd-mobile";
import styles from "./index.less";
import { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import ModelBase from "@/components/ModelBase";
import { useModel, history } from "umi";
import { TAB_ENUM } from "@/components/AppTabs";
import ArrowRight from "./arrowRight";
import storage from "@/utils/storage";
import { isToday } from "@/utils/time";

interface Iporps {
    // isMining: boolean;
}

const BonusTask_id = "BonusTask_tg_id";

/** 今日任务弹窗*/
const BonusTask: React.FC<Iporps> = (props) => {
    const [visiable, setVisiable] = useState(false);
    const { getUnClaimedMission } = useModel('taskModel');
    const { PageTurnTo } = useModel("menuStatus");
    const closeHanlde = () => {
        setVisiable(false);
    }

    const checkInHandle = () => {
        history.push("/Mission");
        closeHanlde();
    }

    const itemClickHandle = (id: string) => {
        history.push("/Mission", { id });
        closeHanlde();
    }

    const openModel = () => {
        if(!getUnClaimedMission() || getUnClaimedMission().length == 0)return;
        setVisiable(true);
        storage.set(BonusTask_id, new Date().getTime());
    }

    useEffect(()=>{
        const timestamp: number = storage.get(BonusTask_id);
        if(!!timestamp){
            const isTodayFlag = isToday(timestamp);
            if(!isTodayFlag){
                openModel();
            }
        }else {
            openModel();
        }
    },[])

    const contentNode = (
        <>
            <img className={styles['topIcon']} src={require('@/assets/images/Mission/dailly_popup_top_icon.png')} />
            <div className={styles['contentView']}>
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
        </>
    )

    const footerNode = (
        <div className={styles['footerView']}>
            <div className={classNames(
                styles['btn'],
            )} onClick={checkInHandle}>
                See More
                <img src={require('@/assets/images/common/popup/icon_right.png')} />
            </div>
        </div>
    )

    return (
        <ModelBase
            visible={visiable}
            onClose={closeHanlde}
            title={"Bonus Task"}
            contentNode={contentNode}
            footerNode={footerNode}
        />
    )
}

export default BonusTask;