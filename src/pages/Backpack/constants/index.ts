import { GEARS_PART_ENUM } from "@/constrants/enums";

export const enum BACKPACK_TAB_ENUM {
  GEAR = "GEAR",
  MERCHANT = "MERCHANT",
}

export const enum BACKPACK_ITEM_TAB_ENUM {
  FEET = GEARS_PART_ENUM.FEET,
  HAND = GEARS_PART_ENUM.HAND,
  BODY = GEARS_PART_ENUM.BODY,
  HEAD = GEARS_PART_ENUM.HEAD,
  ENHANCER = GEARS_PART_ENUM.ENHANCER,
}

export const BACKPACK_CONTENT_TAB_LIST = [
  {
    key: BACKPACK_TAB_ENUM.GEAR,
    name: "Gear",
    isLock: false,
  },
  {
    key: BACKPACK_TAB_ENUM.MERCHANT,
    name: "Merchant",
    isLock: true,
  },
];

export const BACKPACK_ITEM_TAB_LIST = [
  {
    key: BACKPACK_ITEM_TAB_ENUM.FEET,
    name: "Feet",
    isLock: false,
  },
  {
    key: BACKPACK_ITEM_TAB_ENUM.HAND,
    name: "Hands",
    isLock: false,
  },
  {
    key: BACKPACK_ITEM_TAB_ENUM.BODY,
    name: "Body",
    isLock: false,
  },
  {
    key: BACKPACK_ITEM_TAB_ENUM.HEAD,
    name: "Head",
    isLock: false,
  },
  {
    key: BACKPACK_ITEM_TAB_ENUM.ENHANCER,
    name: "Enhancer",
    isLock: false,
  },
];
