import React, { useContext } from "react";
import { AppServiceStatus } from "../../App";

import "./AppServiceHandle.css";

const IPC = window.electron.IPC;


const AppServiceHandle = () => {
  const { isServiceStart, setIsServiceStart } = useContext(AppServiceStatus);

  const service = {
    START: "START",
    STOP: "STOP",
  };
  
  const handleAppService = (e) => {
    setIsServiceStart(!isServiceStart)

    IPC.ipcInvoke("EVENT:INVOCKE:SIGNIG:SERVICE", {isStart: !isServiceStart ? service.START : service.STOP})
  };



  return (
    <>
      <button
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Start Signing"
        className={`btn ${isServiceStart ? "btn-danger" : "btn-success"}`}
        onClick={handleAppService}
      >
        {isServiceStart ? "Stop" : "Start"}
      </button>
    </>
  );
};

export default AppServiceHandle;
