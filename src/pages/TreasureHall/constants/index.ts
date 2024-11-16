import { GEARS_RARITY_ENUM } from "@/constrants/enums";

export const enum TREASURE_TAB_ENUM {
  GEAR = "GEAR",
  HUNT = "HUNT",
  CODEX = "CODEX"
}

export const enum TREASURE_ITEM_FILTER {
  ALL = "all",
  OWNED = "owned",
}

export const TREASURE_CONTENT_TAB_LIST = [
  {
    key: TREASURE_TAB_ENUM.GEAR,
    name: "Gear",
    isLock: false,
  },
  {
    key: TREASURE_TAB_ENUM.HUNT,
    name: "My Hunt",
    isLock: false,
  },
];

export const TREASUER_ITEM_FILTER_LIST = [
  {
    key: TREASURE_ITEM_FILTER.ALL,
    name: "All",
  },
  {
    key: TREASURE_ITEM_FILTER.OWNED,
    name: "Owned",
  },
];

export const TREASURE_GEARS_RARITY_MAP: any = {
  [GEARS_RARITY_ENUM.RARE]: "rare",
  [GEARS_RARITY_ENUM.SUPERIOR]: "superior",
  [GEARS_RARITY_ENUM.EPIC]: "epic",
  [GEARS_RARITY_ENUM.LEGENDARY]: "legendary",
  [GEARS_RARITY_ENUM.COMMON]: "common",
}