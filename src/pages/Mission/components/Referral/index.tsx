import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import HotTaskPopup from "./components/HotTaskPopup";
import InvitePopup from "./components/InvitePopup";
import WebApp from "@twa-dev/sdk";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import classNames from "classnames";
import { useTgAuth } from "@/hooks/useTgAuth";
import { getInviteList } from "@/services/referral";
import { useModel } from "@umijs/max";
import { getTime } from "@/utils/time";
import { KeepAlive, history } from "umi";
import YuliButton from "@/components/YuliButton";
import CoinAccout from "../CoinAccout";
import defalut_user_avatar from "@/assets/images/common/avatar/default_user_avatar.png";
import { deepCopy } from "@/utils/utils";
import { TOAST_TYPE } from "@/components/NewToast";

// @ts-ignore
import { TonConnectUIProvider } from "@tonconnect/ui-react";
const { manifestUrl } = process.env;

const Process_Text_Group = [
  "Share your link",
  "You and your friends both get 2000 GO",
  `invite Telegram Premium and both get 10000 GO`,
];

export enum SwitchKey {
  Tab1 = 1,
  Tab2,
}

const SwitchGroup = [
  { name: "Friends", key: SwitchKey.Tab1, is_premium: false },
  { name: "Premium", key: SwitchKey.Tab2, is_premium: true },
];

interface Iporps {
  friendList: Record<SwitchKey, {data: any[], total: number,  isUpdate: boolean}>;
  isReferRequesting: boolean;
  ReferGetCoinTotal: number;
}

const Referral: React.FC<Iporps> = (props) => {
  const { friendList, isReferRequesting, ReferGetCoinTotal } = props;
  const [isShowHotPopup, setShowHotPopup] = useState(false);
  const [isShowInvitePopup, setShowInvitePopup] = useState(false);
  const [curShowKey, setCurShowKey] = useState(SwitchKey.Tab1);
  
  const [curShowList, setCurShowList] = useState<any[]>([]);

  const [inviterInfo, setInviterInfo] = useState<any>(null);
  const { userInfo } = useModel('useUserInfoModel');
  const { isLogin: isTgLogin } = useModel("useUserInfoModel");
  const copyTextRef = useRef("");

  const getListData = async (quertType: SwitchKey, isUseUpdate = true, init = false) => {
    try {
      const friendListLocal = deepCopy(friendList);

      if(isUseUpdate){
        setCurShowList(friendListLocal[quertType].data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getInviterInfo = async () => {
    const { invited_by_photo_url, invited_by_username } = userInfo || {};
    if (invited_by_username && invited_by_username?.length > 0) {
      setInviterInfo({
        name: invited_by_username,
        avatar_url:
          invited_by_photo_url && invited_by_photo_url?.length > 0 ? invited_by_photo_url : null,
      });
    }
  };

  const CopyLinkHandle = (isShowToast = true) => {
    const url = `${userInfo?.invite_link || " "}`;
    copyTextRef.current = encodeURIComponent(url);
    const copyLinkHandle2 = () => {
      const textArea = document.createElement("textarea");
      textArea.value = url;

      textArea.style.top = "-200";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.select();
      try {
        const successful = document.execCommand("copy");
        if (isShowToast) {
          window.ShowToast("Referral link copied", TOAST_TYPE.Success, 2000);
        }
      } catch (err) {
        window.ShowToast("Copy Failed", TOAST_TYPE.Error, 2000);
      }
      document.body.removeChild(textArea);
    };
    navigator.clipboard
      .writeText(url)
      .then(function () {
        if (isShowToast) {
          window.ShowToast("Referral link copied", TOAST_TYPE.Success, 2000);
        }
      })
      .catch(function (err) {
        copyLinkHandle2();
      });
  };

  const InviteFriendsHandle = () => {
    CopyLinkHandle(false);
    WebApp.openTelegramLink(`https://t.me/share/url?url=${copyTextRef.current}`);
  };


  const handleReferBy = () => {
    setShowInvitePopup(true);
  };

  const switchHandle = (key: SwitchKey) => {
    setCurShowKey(key);
    getListData(key);
  };

  useEffect(() => {
    if (isTgLogin) {
      getInviterInfo();
    }
  }, [isTgLogin]);

  useEffect(()=>{
    getListData(curShowKey);

  },[friendList, isReferRequesting])


  return (
    <div className={styles["page"]}>
      <div className={styles["topView"]}>
        <div className={styles["topView-titleView"]}>
          <img src={require('@/assets/images/Mission/icon_lyra.png')} className={styles['topView-titleView-lyra']}/>
          YuliGO CREW
        </div>
        <div className={styles["topView-descView"]}>
          {`Share your link！You Both get a free bonus.
More friends, more Go!`}
        </div>
        <div className={styles["topView-processView"]}>
          {Process_Text_Group?.map((string, index) => {
            return (
              <div className={styles["lineItem"]} key={index}>
                {/* <img
                  className={styles["light"]}
                  src={require("@/assets/images/common/light_block_on.png")}
                /> */}
                <span>{string}</span>
              </div>
            );
          })}
          <div className={styles['topView-processView-line']}></div>
          <YuliButton text="Invite Friends" onClick={InviteFriendsHandle} buttonCss={styles["topView-processView-btn"]}/>
          <div className={styles["topView-processView-copyLink"]} onClick={() => CopyLinkHandle()}>
            Copy Referral Link
          </div>
        </div>
      </div>
      <div className={styles["bottomView"]}>
        <div className={styles["bottomView-top"]}>
          <div className={styles["bottomView-top-label"]}>
            <img src={require('@/assets/images/Mission/icon_friends.png')} className={styles['bottomView-top-label-icon']}/>
            Friend List
          </div>
          <div className={styles["bottomView-top-referby"]} onClick={handleReferBy}>
            Referred by
          </div>
        </div>
        <div className={styles["bottomView-contain"]}>
          <div className={styles["switchView"]}>
            <div className={styles["switchView-left"]}>
              {SwitchGroup?.map((item) => {
                const { name, key, is_premium } = item;
                return (
                  <div
                    className={classNames(styles["item"], curShowKey == key && styles["active"])}
                    onClick={() => switchHandle(key)}
                    key={key}
                  >
                    {name +
                      ` (${friendList?.[key]?.data?.length || 0})`}
                  </div>
                );
              })}
            </div>
            <div className={styles["switchView-right"]}>
              <CoinAccout number={ReferGetCoinTotal || 0}/>
              {/* <span className={styles["coinText"]}>{getCoinTotal}</span> */}
              {/* <img
                className={styles["coin"]}
                src={require("@/assets/images/common/coin/icon_tokenA.png")}
              /> */}
            </div>
          </div>
          <div className={styles["contentView"]}>
            {curShowList?.length > 0 ? (
              <>
                {curShowList.map((item, index) => {
                  return (
                    <div className={styles["itemView"]} key={index}>
                      <div className={styles["itemView-left"]}>
                        <img
                          className={styles["icon"]}
                          src={defalut_user_avatar}
                        />
                        <span>{item?.username || "unknow"}</span>
                      </div>
                      {/* <div className={styles["itemView-right"]}>
                        {`Join on ${getTime(item?.invited_at * 1000, "YYYY/MM/DD")}`}
                      </div> */}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className={styles["noData"]}>
                <img
                  className={styles["icon"]}
                  src={require("@/assets/images/Mission/role_img.png")}
                />
                <div>No invites yet.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <HotTaskPopup visible={isShowHotPopup} onClose={() => setShowHotPopup(false)} />
      <InvitePopup
        info={inviterInfo}
        visible={isShowInvitePopup}
        onClose={() => setShowInvitePopup(false)}
      />
    </div>
  );
};

export default Referral;
