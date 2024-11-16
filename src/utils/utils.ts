import { THEME_ENUM } from "@/constrants/enums";
import storage from "./storage";

type DeepClone<T> = {
  [P in keyof T]: T[P] extends object ? DeepClone<T[P]> : T[P];
};

/** 深拷贝*/
export function deepCopy<T>(obj: T): DeepClone<T> {
  let copy: any;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export const Debounce = (fn: Function, t: any) => {
  const delay = t || 300;
  let timeout: any;
  return function (...args: any) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn(...args);
      }, delay);
    }
  };
};

/**
 * 退出登录，并且将当前的 url 保存
 */
export const loginOut = () => {
  storage.session_remove("tg_login_session");
};

/**
 * 等待 n 秒
 * @param seconds - 等待的秒数
 * @returns Promise，在指定秒数后解决
 */
export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000); // 将秒数转换为毫秒
  });
}

export const themeRender = (theme: string) => {
  const body = document.getElementsByTagName("body")[0];

  switch (theme) {
    case THEME_ENUM.HALLOWEEN: {
      body.setAttribute("data-theme", THEME_ENUM.HALLOWEEN);
      break;
    }
    case THEME_ENUM.NORMAL: {
      body.setAttribute("data-theme", THEME_ENUM.NORMAL);
      break;
    }

    default: {
      break;
    }
  }
};
