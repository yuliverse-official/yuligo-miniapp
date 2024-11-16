import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import LoadCom from "./components/LoadCom";
import { history } from "umi";

const Pages = () => {
  const [isShowLoading, setShowLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const Timer = useRef<any>();

  useEffect(() => {
    handleRandomProgress();
  }, []);

  const handleRandomProgress = () => {

    Timer.current = setInterval(() => {
      setProgress((prev) => {
        const random = Math.floor(Math.random() * 10);

        if (prev >= 100 || prev + random >= 100) {
          clearInterval(Timer.current);
          history.push("/home");
          return 100;
        }
        return prev + random;
      });
    }, 30);
  };

  return (
    <div className={styles.page}>
      {isShowLoading && <LoadCom progress={progress} />}
      <img src={require("@/assets/images/common/yuligo_logo_black.png")} className={styles.logo} />
      <div className={styles.title}> WELCOME TO YuliGO </div>
      <p className={styles.desc}>
        This mini app, created by the Yuliverse team, allows you to accumulate points by
        participating in daily games. Exchange your points for exciting rewards such as NFTs and
        tokens!
      </p>
      <div className={styles.start} onClick={() => history.push("/Home")}>
        Start Going
      </div>
      <div className={styles.bottom}>
        <div className={styles.join}>Join YuliGo</div>
        <div className={styles.links}>
          <div
            className={styles["links-item"]}
            onClick={() => {
              window.open("https://x.com/theyuliverse?s=21");
            }}
          >
            <img src={require("@/assets/images/welcome/icont_x.png")} alt="" />X
          </div>
          <div
            className={styles["links-item"]}
            onClick={() => {
              window.open("https://t.me/+iKb088QPCW43MmFl");
            }}
          >
            <img src={require("@/assets/images/welcome/icon_tg.png")} alt="" />
            Channel
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;
