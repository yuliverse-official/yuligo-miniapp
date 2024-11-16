declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

declare let ga: () => void;

declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare type GlobalValidatorConfig = {
  name?: string; // 需要校验的名称
  data?: any; // 在校验中需要用到的数据
};

declare type RoutesConfig = {
  name?: string;
  path?: string;
  meta?: {
    icon?: any;
    key?: string;
  };
  text?: string;
  component?: string;
  routes?: RoutesConfig[];
  children?: RoutesConfig[];
  // layout?: boolean; // 取消布局
  hideInMenu?: boolean; // 在菜单里隐藏
};

declare type Store = {
  [key: string]: any;
};

export type SimpleFunction = (input?: any) => void;