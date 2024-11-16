import { useEffect, useRef, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames";
import HuntRecordItem from "./components/HuntRecordItem";
import { useModel } from "@umijs/max";
import { InfiniteScroll } from "antd-mobile";
import { getTreasureHallHistories } from "@/services/CityTreasureHunt";

const MyHuntList: React.FC = () => {
  const [recordList, setRecordList] = useState<any>([]);

  const pageRef = useRef(1);
  const [isHasMore, setHasMore] = useState(false);

  const handleGetTreasureHallHistories = async (page?: number) => {
    try {
      const res = await getTreasureHallHistories({
        page: page || 1,
        page_size: 100,
      });
      console.log("res", res);
      const data = res?.data || [];
      const total = res?.total || 0;
      return { data, total };
    } catch (error) {
      return { data: null, total: 0 };
    }
  };

  const handleGetHuntRecord = async () => {
    window.ShowLoading();

    // @ts-ignore
    const data = await handleGetTreasureHallHistories(pageRef.current);
    await handleParseData(recordList, data);

    window.HideLoading();
  };

  const handleParseData = (list: any[], res: any) => {
    const data = res?.data || [];
    const total = res?.total || 0;
    const _list = [...list, ...data];
    setRecordList(_list);

    const isAll = total <= _list.length;
    const isHasMore = !isAll;
    if (isHasMore) {
      pageRef.current = pageRef.current + 1;
    }
    setHasMore(isHasMore);
  };

  const handleLoadMore = async () => {
    await handleGetHuntRecord();
  };

  useEffect(() => {
    pageRef.current = 1;
    handleGetHuntRecord();
  }, []);

  return (
    <div className={styles["pages"]}>
      <div className={styles["block-content-list"]} id="shopList">
        {!recordList?.length && (
          <div className={styles["block-content-default"]}>
            <div className={styles["block-content-default-icon"]}></div>
            <div className={styles["block-content-default-text"]}>
              The treasure hall is completely empty! Embark on your hunt now and
              claim priceless treasures!
            </div>
          </div>
        )}
        {!!recordList?.length && (
          <>
            {recordList.map((item: any, index: number) => {
              return (
                <div className={styles["block-content-item"]} key={index}>
                  <HuntRecordItem data={item} />
                </div>
              );
            })}
            <InfiniteScroll loadMore={handleLoadMore} hasMore={isHasMore}>
              <></>
            </InfiniteScroll>
          </>
        )}
      </div>
    </div>
  );
};

export default MyHuntList;
