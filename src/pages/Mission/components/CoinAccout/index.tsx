import classNames from "classnames";
import { MissionItemType, MissionStatus } from "../../type";
import styles from "./index.less";
import defalut_coin from "@/assets/images/common/coin/goods_icon_go2.png";
import { NumberFormat } from "@/utils/format";
import { useModel } from "@umijs/max";
import cp_coin from "@/assets/images/common/coin/goods_icon_cp.png"

interface Iporps {
    coinIcon?: string;
    number?: number | string; 
    mode?: string;
}

const CoinAccout: React.FC<Iporps> = (props) => {
    const { coinIcon, number, mode } = props;
    const { userInfo } = useModel('useUserInfoModel');
    return (
        <>
            {
                !mode &&
                <div className={styles['page']}>
                    <img src={coinIcon || defalut_coin} className={styles['page-icon']}/>
                    <div className={styles['page-number']}>{
                        NumberFormat(Number(
                            !(number || number == 0 )
                            ? userInfo?.wallet_info?.token_go
                            : number
                        ))
                    }</div>
                </div>
            }
            {
                mode == 'home' &&
                <div className={styles['pageHome']}>
                    <div className={styles['page']}>
                        <img src={cp_coin} className={styles['page-icon']}/>
                        <div className={styles['page-number']}>{
                            NumberFormat(Number(userInfo?.collection_points))
                        }</div>
                    </div>
                    <div className={styles['page']}>
                        <img src={defalut_coin} className={styles['page-icon']}/>
                        <div className={styles['page-number']}>{
                            NumberFormat(Number(userInfo?.wallet_info?.token_go))
                        }</div>
                    </div>
                </div>
            }
        </>
    )
}

export default CoinAccout;