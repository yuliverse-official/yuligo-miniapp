import classNames from "classnames";
import { MissionItemType, MissionStatus } from "../../type";
import styles from "./index.less";

interface Iporps {
    missionInfo: MissionItemType;
    onItemTouch: (info: MissionItemType) => void;
}

const MissionItem: React.FC<Iporps> = (props) => {
    const { missionInfo, onItemTouch } = props;

    return (
        <div className={classNames(
            styles['page'],
            missionInfo.status == MissionStatus.Claimed && styles['claimedBg'],
        )} onClick={()=>{onItemTouch && onItemTouch(missionInfo)}}>
            <div className={styles['page-left']}>
                <div className={classNames(
                    styles['page-left-taskIcon'],
                    missionInfo.status == MissionStatus.Claimed && styles['page-claimed'],
                )}>
                    <img src={missionInfo.taskIcon}/>
                </div>
                <div className={styles['page-left-box']}>
                    <div className={styles['page-left-box-title']}>{missionInfo.taskName}</div>
                    {/* <div className={styles['page-left-box-desc']}>{missionInfo.taskDesc}</div> */}
                    {/* extra */}
                </div>
            </div>
            <div className={styles['page-right']}>
                <span>{missionInfo.reward}</span>
                <img className={styles['page-right-rewardIcon']} 
                     src={missionInfo?.rewardCoin?.icon} />
            </div>
            {/* status */}
            {
                missionInfo.status == MissionStatus.Claim &&
                <div className={styles['page-claim']}>Reward</div>
            }
        </div>
    )
}

export default MissionItem;