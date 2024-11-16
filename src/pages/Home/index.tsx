import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { PAGInit } from "libpag";
import Lottie from "react-lottie";
import yuligo_lyra from "@/assets/json/yuligo_lyra1.json";
import { history } from "umi";
import CoinAccout from "../Mission/components/CoinAccout";
import RewardPopup from "./RewardPopup";
import KeepAlive, { useActivate, useUnactivate } from "react-activation";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useModel } from "@umijs/max";
import _ from "lodash";
import { NumberFormat, toFixedWithMode } from "@/utils/format";
import BonusTask from "@/pages/Mission/BonusTask";
import WebApp from "@twa-dev/sdk";
import { MAX_ROLE_LEVEL } from "@/constrants/enums/valueEnums";
import { getGoingReceive } from "@/services/going";
import { TOAST_TYPE } from "@/components/NewToast";
import TryAgainPopup from "./TryAgainPopup";
import { MISSION_API_TAG_TYPE } from "../Mission/type";
import classNames from "classnames";
import { THEME_ENUM } from "@/constrants/enums";
import storage from "@/utils/storage";
import { themeRender } from "@/utils/utils";

const { manifestUrl } = process.env;

const Home = () => {
  const [claimVisible, setClaimVisible] = useState(false);
  const [goRateSeconds, setGoRateSeconds] = useState("0");
  const [goingRes, setGoingRes] = useState<any>("");
  const [goRateHours, setGoRateHours] = useState("");
  const [curRoleLevel, setCurRoleLevel] = useState(0);
  const [load_anim_ops, setLoadAnimOps] = useState({
    loop: true,
    autoplay: true,
    animationData: yuligo_lyra,
  });
  const [goingReward, setGoingReward] = useState<any>(null);
  const [isGetCliam, setIsGetCliam] = useState(false);
  const [isShowLottie, setShowLottie] = useState(true);
  const [tryAgainText, setTryAgainText] = useState("");
  const [tryAgainVisible, setTryAgainVisible] = useState(false);
  const [curRolePerExp, setCurRolePerExp] = useState(0);

  const goingRateRef = useRef(0);
  const goingResRef = useRef(0);

  const { isLogin: isTgLogin } = useModel("useUserInfoModel");
  const { UserAllRoles, useRoleType, initHandle, updateRolesList } = useModel("rolesModel");
  const [curRoleData, setCurRoleData] = useState(UserAllRoles?.[useRoleType] || {});
  const { userInfo, updateUserInfoHanlde } = useModel("useUserInfoModel");

  const Timer = useRef<any>(null);
  const ClaimCountDown = useRef<any>(null);

  const LeftTIme = useRef(0);
  useEffect(() => {
    if (isTgLogin) {
      initHandle();
    }
  }, [isTgLogin]);

  useEffect(() => {
    if (!!UserAllRoles) {
      const data = UserAllRoles?.[useRoleType];

      setCurRoleData(data);
      handleGetGoingsData(data);
    }
  }, [UserAllRoles, useRoleType]);

  const handleRefresh = async () => {
    await updateUserInfoHanlde();
    await updateRolesList();
  };

  const handleAddTime = () => {
    Timer.current = setInterval(() => {
      let curData = Number(goingResRef.current);
      let res = curData + Number(goingRateRef.current);

      goingResRef.current = res;
      setGoingRes(res);
    }, 1000);
  };

  const handleGetGoingsData = async (data: any) => {
    Timer.current && clearInterval(Timer.current);
    Timer.current = null;
    goingResRef.current = 0;
    setGoingRes("");
    const roleRes = data?.roleInfo;

    if (roleRes) {
      const _run_rate_reward = _.get(roleRes, "run_info.run_rate_reward", "0") || "0";
      const _run_rate_hour = _.get(roleRes, "run_info.run_rate", "0") || "0";
      const _run_rate_seconds = _.get(roleRes, "run_info.run_rate_seconds", "0") || "0";
      const _role_level = _.get(roleRes, "level", 0);
      const _elapsed = _.get(roleRes, "run_info.elapsed", 0) || 0;
      const _cur = _.get(roleRes, "cur", 0) || 0;
      const _next = _.get(roleRes, "next", 0) || 0;
      const progress = (Number(_cur) / Number(_next)) * 100;

      setCurRolePerExp(progress);
      LeftTIme.current = _elapsed;
      handleCountDown();

      setCurRoleLevel(_role_level);
      setGoRateSeconds(_run_rate_seconds);
      goingRateRef.current = _run_rate_seconds;
      goingResRef.current = _run_rate_reward;
      setGoingRes(_run_rate_reward);
      setGoRateHours(_run_rate_hour);

      handleAddTime();
    }
  };

  const handelGetReward = async () => {
    if (LeftTIme.current < 20) {

      setTryAgainVisible(true);
      return;
    }
    if (isGetCliam) {
      return;
    }

    window.ShowLoading();

    try {
      setIsGetCliam(true);
      const res = await getGoingReceive();

      if (res) {
        const data = _.get(res, "data.token_go", "0") || "0";
        setGoingReward(data);
        await handleRefresh();
        window.HideLoading();
        setClaimVisible(true);
        setIsGetCliam(false);
      }
    } catch (error) {

      const data = _.get(error, "response.data", "");
      const code = _.get(data, "code", "");
      const msg = _.get(data, "msg", "");

      if (code === 403100) {
        window.HideLoading();
        setIsGetCliam(false);

        return;
      }
      window.HideLoading();
      setIsGetCliam(false);
      window.ShowToast(msg, TOAST_TYPE.Error, 3000);
    }
  };

  const handleCountDown = () => {
    ClaimCountDown.current = setInterval(() => {
      LeftTIme.current++;

      if (LeftTIme.current >= 20) {
        setTryAgainText(`Try Again `);
        clearInterval(ClaimCountDown.current);
        return;
      }

      setTryAgainText(`Try Again in ${20 - LeftTIme.current}s`);
    }, 1000);
  };

  const handelSwitchTheme = () => {
    const theme = storage.get("theme") || THEME_ENUM.HALLOWEEN;
    if (theme === THEME_ENUM.HALLOWEEN) {
      themeRender(THEME_ENUM.NORMAL);
      storage.set("theme", THEME_ENUM.NORMAL);
    } else {
      themeRender(THEME_ENUM.HALLOWEEN);
      storage.set("theme", THEME_ENUM.HALLOWEEN);
    }
  };

  useUnactivate(() => {
    setShowLottie(false);
  });

  useActivate(() => {
    setShowLottie(true);
  });

  return (
    <div className={styles.page}>
      <RewardPopup
        text={goingReward}
        onClose={() => {
          setClaimVisible(false);
          setGoingReward("");
        }}
        visiable={claimVisible}
      />
      <TryAgainPopup
        text={tryAgainText}
        onClose={() => setTryAgainVisible(false)}
        visiable={tryAgainVisible}
      />
      <div className={styles.header}>
        <CoinAccout mode="home" />
      </div>
      <div className={styles.content}>
        <div className={styles.lyra}>
          <div className={styles["lyra-sprites"]}>
            <img
              className={styles["lyra-sprites-top"]}
              src={require("@/assets/images/home/sprite1.png")}
            />
            <img
              className={styles["lyra-sprites-bottom"]}
              src={require("@/assets/images/home/sprite2.png")}
            />
          </div>
          <img
            className={styles["lyra-pumpkin"]}
            src={require("@/assets/images/home/icon_pumpkin.png")}
            alt=""
          />

          {isShowLottie && (
            <Lottie
              options={load_anim_ops}
              height={182}
              width={182}
              isClickToPauseDisabled={true}
            />
          )}
        </div>

        <div className={styles.progress}>
          <div className={styles["progress-num"]}>Lv.{curRoleLevel}</div>
          <div className={styles["progress-bg"]}>
            <div style={{ width: `${curRolePerExp}%` }} className={styles["progress-bg-bar"]}></div>
          </div>
        </div>
        <div className={styles.claim} onClick={handelGetReward}>
          <div className={styles["claim-speed"]}>
            <span className={styles["claim-speed-num"]}>
              {NumberFormat(Number(goRateHours))}
              /h
            </span>
          </div>
          <div className={styles["claim-main"]}>
            <div className={styles["claim-main-amount"]}>{toFixedWithMode(goingRes, 2)} Miles</div>
            <div className={styles["claim-main-content"]}>
              <div className={styles["claim-main-content-text"]}>Claim</div>

              <div className={styles["claim-main-content-bg"]}></div>
            </div>
          </div>
          <img
            className={styles["claim-icon"]}
            src={require("@/assets/images/home/icon_go.png")}
            alt=""
          />
          {userInfo?.treasure_mark_buff && userInfo?.treasure_mark_buff != "0" && (
            <div className={styles["claim-boost"]}>Boost x {userInfo?.treasure_mark_buff}</div>
          )}
        </div>
        <div className={styles.menu}>
          <div className={styles["menu-item"]} onClick={() => history.push("/SpeedBoost")}>
            <div
              className={classNames(styles["menu-item-icon"], styles["menu-item-icon-speed"])}
            ></div>
            <span className={styles["menu-item-text"]}>Speed Boost</span>
          </div>
          <div
            className={styles["menu-item"]}
            onClick={() => history.push("/Mission", { tab: MISSION_API_TAG_TYPE.Tab1 })}
          >
            <div
              className={classNames(styles["menu-item-icon"], styles["menu-item-icon-task"])}
            ></div>
            <span className={styles["menu-item-text"]}>Go Task</span>
          </div>
          <div className={styles["menu-item"]} onClick={() => history.push("/Backpack")}>
            <div
              className={classNames(styles["menu-item-icon"], styles["menu-item-icon-item"])}
            ></div>
            <span className={styles["menu-item-text"]}>Item</span>
            {/* <div className={styles["menu-item-coming"]}>Coming Soon</div> */}
          </div>
        </div>
      </div>
      <div className={styles["icon_street"]} onClick={handelSwitchTheme}>
        <div className={styles["icon_street-icon"]}></div>
        {/* <img src={require("@/assets/images/home/street_hall.png")} alt="" /> */}
        <div className={styles["icon_street-text"]}>street</div>
      </div>
      <div className={styles["nets"]}>
        <div className={styles["nets-line"]}>
          <img
            className={styles["nets-line-spider"]}
            src={require("@/assets/images/home/spider.png")}
            alt=""
          />
        </div>
      </div>
      <BonusTask />
    </div>
  );
};

const KeepAlivePage: React.FC = () => {
  return (
    <KeepAlive
      name="Home"
      when={() => {
        return history.action === "PUSH";
      }}
    >
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Home />
      </TonConnectUIProvider>
    </KeepAlive>
  );
};

export default KeepAlivePage;
