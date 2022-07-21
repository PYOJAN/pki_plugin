import React, { useEffect, useMemo } from "react";
import { useDataLayerValue } from "../Contexts/DataLayer";
import FormLeft from "../Forms/FormLeft";
import FormRight from "../Forms/FormRight";

import "./SignatureConfig.css";

// Electron
const IPC = window.electron.IPC;

const SignatureConfig = () => {
  const [_, dispatch] = useDataLayerValue();

  // Getting
  useEffect(() => {
    const getAllInitData = async () => {
      const allData = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA");

      dispatch({
        value: allData.signature,
      });
    };

    getAllInitData();
    // setTimeout(() => {
    // }, 3000);
  }, [dispatch]);

  return (
    <div className="signature__config container-fluid">
      <div className="row row-col-2 h-100 position-relative">
        <div className="col h-100 pt-1 pb-2">
          <FormLeft />
        </div>
        <div
          className="d-flex flex-column col h-100 pb-2"
          style={{ gap: "5px" }}
        >
          <FormRight />
        </div>
      </div>
    </div>
  );
};

export default SignatureConfig;
