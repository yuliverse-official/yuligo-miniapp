import styles from "./index.less";
import { ReactNode } from "react";
import ModelBase from "@/components/ModelBase";
import classNames from "classnames";

interface Iporps {
    visible: boolean;
    onClose: () => void;
}

const Bonus_Group = [
    {
        icon: '',
        title: 'Bonus 1',
        desc: 'X amount of X coins',
        toDo: '1',
    },
    {
        icon: '',
        title: 'Bonus 2',
        desc: '1 Lucky Spin',
        toDo: '2',
    },
    {
        icon: '',
        title: 'Bonus X',
    },
];

const HotTaskPopup: React.FC<Iporps> = (props) => {
    const { visible, onClose, } = props;

    const getBtnText = () => {
        let text = 'get';
        return text;
    }

    const BonusClickHandle = (todo: any) => {
        if(!todo)return;
        console.log(todo);
    }

    const TitleNode = (
        <div className={styles['titleView']}>
            <span>Hot Reward Task</span>
            {/* <img className={styles['dog']} src={require('@/assets/images/common/single_dog.png')} /> */}
        </div>
    )

    const ContentNode = (
        <div className={styles['contentView']}>
            <div className={styles['innerView']}>
                {
                    Bonus_Group?.map((item, index) => {
                        return (
                            <div className={styles['boxItem']} 
                                 key={index}
                                 onClick={()=>BonusClickHandle(item?.toDo)}>
                                <div className={styles['boxItem-left']}>
                                    <img src={item?.icon}/>
                                    <div className={styles['boxItem-left-box']}>
                                        <div className={styles['title']}>{item?.title}</div>
                                        {
                                            item?.desc &&
                                            <div className={styles['desc']}>{item.desc}</div>
                                        }
                                    </div>
                                </div>
                                <div className={styles['boxItem-right']}>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

    const FooterNode = (
        <div className={styles['footerView']}>
            <div className={styles['textBox']}>
                <div className={classNames(styles['icon'], styles['iconLeft'])}></div>
                <div className={styles['text']}>Click to Close</div>
                <div className={classNames(styles['icon'], styles['iconRight'])}></div>
            </div>
        </div>
    )

    return (
        <ModelBase
            visible={visible}
            onClose={onClose}
            titleNode={TitleNode}
            contentNode={ContentNode}
            footerNode={FooterNode}
        />
    )
}

export default HotTaskPopup;