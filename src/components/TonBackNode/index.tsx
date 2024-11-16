import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { useActivate } from "react-activation";

const TonBackNode: React.FC = () => {
  useEffect(() => {
    WebApp.BackButton.show();
    return () => {
      WebApp.BackButton.hide();
    }
  }, []);

  useActivate(()=>{
    WebApp.BackButton.show();
  })

  return (
    <div></div>
  );
};

export default TonBackNode;
