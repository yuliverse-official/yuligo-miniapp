import styles from "./index.less";
import { ReactNode } from "react";
import ModelBase from "@/components/ModelBase";
import classNames from "classnames";
import defalut_user_avatar from "@/assets/images/common/avatar/default_user_avatar.png";

interface Iporps {
    visible: boolean;
    onClose: () => void;
    info?: any;
}

const InvitePopup: React.FC<Iporps> = (props) => {
    const { visible, onClose, info } = props;

    const getBtnText = () => {
        let text = 'get';
        return text;
    }

    const ContentNode = (
        <div className={styles['contentView']}>
            <span className={styles['contentView-label']}>I was inviter by</span>
            {
                !!info 
                ?   <div className={styles['inviteBy']}>
                        <img className={styles['icon']} src={
                            info?.avatar_url || 
                            defalut_user_avatar
                        }/>
                        {info?.name || 'unknow'}
                    </div>
                :   <div className={styles['none']}>
                        {/* No one invites you */}
                        {"-"}
                    </div>
            }
        </div>
    )

    const FooterNode = (
        <div className={styles['footerView']}></div>
    )

    return (
        <ModelBase
            visible={visible}
            onClose={onClose}
            title={'Inviter'}
            contentNode={ContentNode}
            footerNode={FooterNode}
        />
    )
}

export default InvitePopup;