import React, { useContext } from "react";
import toast from "react-hot-toast";
import { AppServiceStatus } from "../../App";

import "./AppServiceHandle.css";

const IPC = window.electron.IPC;

const AppServiceHandle = () => {
  const { isServiceStart, setIsServiceStart } = useContext(AppServiceStatus);

  const service = {
    START: "START",
    STOP: "STOP",
  };

  const handleAppService = async (e) => {
    const serviceStatus = await IPC.ipcInvoke("EVENT:INVOCKE:SIGNIG:SERVICE", {
      isStart: !isServiceStart ? service.START : service.STOP,
    });
    const { isValid, message } = serviceStatus;

    if (!isValid) return toast.error(message);

    setIsServiceStart(!isServiceStart);
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
