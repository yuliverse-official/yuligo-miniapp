import ModelBase from "@/components/ModelBase";
import styles from "./styles.less";
import classNames from "classnames";
import { Input } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import { TOAST_TYPE } from "@/components/NewToast";
import { postBindEmail, postEmailCaptcha } from "@/services/user";

const enum TMPL_TYPE {
  BIND = "bind_email",
  UN_BIND = "unbind_email",
}

interface IUserBindEmailPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onBind?: (email: string) => void;
}

const UserBindEmailPopup: React.FC<IUserBindEmailPopupProps> = (props) => {
  const { isVisible, onClose, onBind } = props;

  const [inputEmail, setInputEmail] = useState("");
  const [inputCode, setInputCode] = useState("");

  const [isGetCaptcha, setGetCaptcha] = useState(false); // 是否正在请求验证码
  const [isGetCodeClick, setGetCodeClick] = useState(false); // 是否点击过

  const SECONDS = 60;
  const [isCodeCountdown, setCodeCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const timmer = useRef<any>(null);

  const [isCanBindClick, setCanBindClick] = useState(false); // 是否可以绑定
  const [isBindClick, setBindClick] = useState(false);

  const handleClose = () => {
    onClose && onClose();
  };

  const handleEmailChange = (val: any) => {
    setInputEmail(val);
  };

  const handleCodeChange = (val: any) => {
    const _val = val.slice(0, 6);
    setInputCode(_val);
  };

  const handleGetCodeClick = async () => {
    if (!inputEmail) {
      return;
    }

    if (isCodeCountdown || isGetCaptcha) {
      return;
    }

    setGetCaptcha(true);
    try {
      const res = await postEmailCaptcha({
        email: inputEmail,
        tmpl_type: TMPL_TYPE.BIND,
      });
      window.ShowToast(
        "Captcha sent successfully!",
        TOAST_TYPE.Success,
        3000
      );
      setGetCodeClick(true);
      handleGetCodeCountdown(SECONDS);
    } catch (error: any) {
      const code = error?.response?.data?.code;
      const msg = error?.response?.data?.msg;
      let tips = "Send failed, please try again later!";
      if (msg.includes("InvalidEmail")) {
        tips = "InvalidEmail, please try again later!";
      }

      if (code == 400105) {
        tips = "Email repeat, please try again later!";
      }

      window.ShowToast(tips, TOAST_TYPE.Error, 3000);
      setGetCaptcha(false);
    }
  };

  const handleGetCodeCountdown = (value: number) => {
    if (value === 0) {
      setCodeCountdown(false);
      setGetCaptcha(false);
      return;
    }

    setCountdownSeconds(value);
    setCodeCountdown(true);

    const seconds = value - 1;
    timmer.current && clearTimeout(timmer.current);
    timmer.current = setTimeout(() => {
      handleGetCodeCountdown(seconds);
    }, 1000);
  };

  const handleBindClick = async () => {
    if (!isCanBindClick || isBindClick) {
      return;
    }

    setBindClick(true);
    try {
      const res = await postBindEmail({
        email: inputEmail,
        captcha: inputCode,
      });
      window.ShowToast("Binding successful!", TOAST_TYPE.Success, 3000);
      onBind && onBind(inputEmail);
      onClose && onClose();
    } catch (error) {
      window.ShowToast(
        "Binding failed, please try again!",
        TOAST_TYPE.Error,
        3000
      );
      setBindClick(false);
    }
  };

  const handleReset = () => {
    setInputEmail("");
    setInputCode("");
    setGetCodeClick(false);
  };

  useEffect(() => {
    if (!isCodeCountdown && isVisible) {
      handleReset();
    }
  }, [isVisible]);

  useEffect(() => {
    setCanBindClick(
      inputCode.length > 0 && inputEmail?.length > 0 && isGetCodeClick
    );
  }, [inputCode, inputEmail, isGetCodeClick]);

  const CONTENT_NODE = (
    <div className={styles["block-info"]}>
      <div
        className={classNames(
          styles["black-border"],
          styles["info-input-email"]
        )}
      >
        <div className={styles["info-input-email-icon"]}></div>
        <div className={styles["info-input-email-name"]}>Email</div>
        <div className={styles["info-input-email-inputbox"]}>
          <Input
            placeholder="Email Address"
            value={inputEmail}
            onChange={handleEmailChange}
            style={{
              "--placeholder-color": "#BFBFBF",
              "--color": "#000000",
              "--font-size": "14px",
            }}
          />
        </div>
      </div>
      <div className={styles["info-input-code"]}>
        <div
          className={classNames(
            styles["black-border"],
            styles["info-input-code-inputbox"]
          )}
        >
          <Input
            placeholder="Verification Code"
            value={inputCode}
            onChange={handleCodeChange}
            style={{
              "--placeholder-color": "#BFBFBF",
              "--color": "#000000",
              "--font-size": "14px",
            }}
            type="number"
          />
        </div>
        <div
          className={classNames(
            styles["info-input-code-btn"],
            isCodeCountdown && styles["info-input-code-btn-disable"],
            !inputEmail && styles["info-input-code-btn-disable"]
          )}
          onClick={handleGetCodeClick}
        >
          {!isCodeCountdown ? (
            <div className={styles["info-input-code-btn-text"]}>Get code</div>
          ) : (
            <div className={styles["info-input-code-btn-text"]}>
              {countdownSeconds}s
            </div>
          )}
        </div>
      </div>
      <div
        className={classNames(
          styles["info-input-btn"],
          !isCanBindClick && styles["info-input-btn-disable"]
        )}
        onClick={handleBindClick}
      >
        <div className={styles["info-input-btn-text"]}>Bind</div>
      </div>
    </div>
  );

  return (
    <ModelBase
      visible={isVisible}
      onClose={handleClose}
      title={"Bind your Email"}
      contentNode={CONTENT_NODE}
      ContentClass={styles["content"]}
    />
  );
};

export default UserBindEmailPopup;
