import React, { useState } from "react";
import { VscClose } from "react-icons/vsc";
import "./Header.css";

import appLogo from "../../assets/plug.png";

const IPC = window.electron.IPC;

export default function Header() {
  const [appName, setAppName] = useState("app Name");

  IPC.on("INIT:DATA", (e, arg) => {
    const { appName } = arg;
    setAppName(appName.split("_").join(" "));
  });

  // Window hide control
  const winHideHandle = (e, arg) => {
    e.preventDefault();
    IPC.ipcSendEvent("EVENT:FROM:RENDER", arg);
  };
  return (
    <>
      {/* Window top bar */}
      <div className="top__frame w-100"></div>
      <div className="win__action d-flex align-items-center" data-app="info">
        <img src={appLogo} alt="App Icon" width={20} height={20} />
        <span className="mx-2 d-inline-block">{appName}</span>
      </div>

      <div className="win__action d-flex align-items-center" data-app="action">
        <VscClose
          className="action-btn"
          onClick={(e) => winHideHandle(e, "hide")}
        />
      </div>
    </>
  );
}
