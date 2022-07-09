import React, { useEffect, useState } from "react";
import "./Footer.css";

const IPC = window.electron.IPC;

export default function Footer() {
  const [version, setVersion] = useState("v");

  /**
   * @param UseEffect Getting initial data from database in startup
   */
  useEffect(() => {
    const getDirs = async () => {
      const appVersion = await IPC.ipcInvoke(
        "EVENT:INVOCKE:GET:DATA",
        "APPVERSION"
      );
      setVersion(appVersion);
    };

    getDirs();
  }, []);

  return (
    <div className="footer__frame w-100 d-flex align-items-center justify-content-arround px-2">
      <span>V: {version}</span>
    </div>
  );
}
