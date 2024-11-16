import "@/assets/styles/Normalize.less";
import "@/assets/styles/common.less";
import "./assets/font/font.css";
import WebApp from "@twa-dev/sdk";
import storage from "./utils/storage";
import { autoFixContext } from "react-activation";
import jsxRuntime from "react/jsx-runtime";
import jsxDevRuntime from "react/jsx-dev-runtime";
import _ from "lodash"; // lodash
import { TOAST_TYPE } from "./components/NewToast";
import { loginOut, themeRender } from "./utils/utils";
import { THEME_ENUM } from "./constrants/enums";

autoFixContext([jsxRuntime, "jsx", "jsxs", "jsxDEV"], [jsxDevRuntime, "jsx", "jsxs", "jsxDEV"]);

WebApp.ready();
WebApp.expand();

WebApp.BackButton.onClick(()=>{
  history.back();
})

const theme = storage.get("theme") || THEME_ENUM.HALLOWEEN;

themeRender(theme);
storage.set("theme", THEME_ENUM.HALLOWEEN);

const ResponseInterceptors = (response: any, options: any) => {
};

const errorHandler = (error: any) => {
  const { response, data } = error;
  const responseStatus = _.get(response, "status", 0);

  if (!response) {
    throw error;
  }
};

export const request = {
  baseURL: "",
  timeout: 10000,
  errorConfig: {
    errorHandler: errorHandler,
    errorThrower() {},
  },
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [ResponseInterceptors],
};
