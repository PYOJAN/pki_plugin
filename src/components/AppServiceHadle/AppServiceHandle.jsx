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

  // IPC.once("MESSGAES", (_, message) => {
  //   toast.error(message);
  //   setIsServiceStart(service.STOP);
  // })

  const handleAppService = async (e) => {
    setIsServiceStart(!isServiceStart);
    const serviceStatus = await IPC.ipcInvoke("EVENT:INVOCKE:SIGNIG:SERVICE", {
      isStart: !isServiceStart ? service.START : service.STOP,
    });
    const { isValid, message } = serviceStatus;
    if (!isValid) {
      setIsServiceStart(false);
      return message !== undefined && toast.error(message);
    }
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
