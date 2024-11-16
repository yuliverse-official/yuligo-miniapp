import { postLogin } from "@/services/pre";
import storage from "@/utils/storage";
import WebApp from "@twa-dev/sdk";
import { useState } from "react";
import { Outlet, useModel } from "umi";

export default () => {

  return <Outlet />;
};
