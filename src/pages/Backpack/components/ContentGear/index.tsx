import { useEffect, useState } from "react";
import {
  BACKPACK_ITEM_TAB_ENUM,
  BACKPACK_ITEM_TAB_LIST,
} from "../../constants";
import styles from "./styles.less";
import classNames from "classnames";
import BackpackItemTab from "../BackpackItemTab";
import BackpackGearItem from "./components/BackpackGearItem";
import { useModel } from "@umijs/max";
import { ITreasureHallProps } from "@/models/treasureHallModel";
import { TOAST_TYPE } from "@/components/NewToast";
import { postRoleGearEquip } from "@/services/user";
import { useActivate } from "react-activation";

interface IContentGearProps {
  activeKeyExternal?: string;
  onClickShop?: (activeKey?: string) => void;
}

const ContentGear: React.FC<IContentGearProps> = (props) => {
  const { activeKeyExternal, onClickShop } = props;
  const { handleGetActiveGearsByFilter, UpdateTreasureHallGears } =
    useModel("treasureHallModel");

  const { updateRolesList, getRoleInfoByRoleType } = useModel("rolesModel");

  const [activeKey, setActiveKey] = useState<any>("");
  const [activeItem, setActieItem] = useState<any>(null);

  const [gearList, setGearList] = useState<ITreasureHallProps[]>([]);

  const [isRequestLoading, setRequestLoading] = useState(false);

  const handleTabClick = (key: BACKPACK_ITEM_TAB_ENUM) => {
    if (key === activeKey) {
      return;
    }

    setActiveKey(key);
  };

  const handleToShop = () => {
    onClickShop && onClickShop(activeKey);
  };

  const handleRefreshGearList = async () => {
    window.ShowLoading();

    const data = await handleGetActiveGearsByFilter(activeKey);
    setGearList(data);

    const el = document.querySelector("#list");
    el && el.scrollTo(0, 0);

    window.HideLoading();
  };

  const handleGearEquip = async (data: any) => {

    if (isRequestLoading) return;

    const gear_id = data?.id || "";
    const role_info = await getRoleInfoByRoleType();
    const role_id = role_info?.role_id || "";

    setRequestLoading(true);
    window.ShowLoading();

    try {
      const res = await postRoleGearEquip({
        role_id,
        gear_id,
      });

      await handleEquipRefresh();

      window.ShowToast("Equip Successfully!", TOAST_TYPE.Success, 3000);

      updateRolesList();

      setRequestLoading(false);
    } catch (error) {
      setRequestLoading(false);
      window.ShowToast(
        "Equip failed, please try again later!",
        TOAST_TYPE.Error,
        3000
      );
    } finally {
      window.HideLoading();
    }
  };

  const handleEquipRefresh = async () => {
    const _list = await UpdateTreasureHallGears();
    const _data = await handleGetActiveGearsByFilter(activeKey, _list);
    setGearList(_data);
  };

  useEffect(() => {
    setActiveKey(activeKeyExternal || BACKPACK_ITEM_TAB_ENUM.FEET);
  }, [activeKeyExternal]);

  useEffect(() => {
    if (!activeKey) return;

    const activeItem = BACKPACK_ITEM_TAB_LIST.find((item) => {
      return item?.key === activeKey;
    });
    setActieItem(activeItem);

    handleRefreshGearList();
  }, [activeKey]);

  useActivate(() => {
    handleEquipRefresh();
  });

  return (
    <div className={styles["pages"]}>
      <BackpackItemTab
        tabList={BACKPACK_ITEM_TAB_LIST}
        activeKey={activeKey}
        onClick={handleTabClick}
      />

      <div className={styles["block-content"]}>
        <div className={styles["backpack-list"]} id="list">
          <div className={styles["backpack-item-shop"]} onClick={handleToShop}>
            <div
              className={classNames(styles["backpack-item-shop-name"])}
            >{`Go to the Treasure hall to activate more gear!`}</div>
          </div>
          {gearList.map((item: ITreasureHallProps, index: number) => {
            return (
              <div className={styles["backpack-item"]} key={index}>
                <BackpackGearItem data={item} onEquip={handleGearEquip} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentGear;
