import React, { useContext, useState } from "react";
import WorkingDir from "../workingDirs/WorkingDir";
import Address from "../PkiAddress/Address";
import SignatureConfig from "../SignatureConfig/SignatureConfig";
import { DataLayer } from "../Contexts/DataLayer";
import reducer, { initialState } from "../Contexts/reducer";
import { AppServiceStatus } from "../../App";
import * as VsIcon from "react-icons/vsc";
import * as FaIcon from "react-icons/fa";

import "./MainBody.css";
const IPC = window.electron.IPC;

export default function MainBody() {
  const { isServiceStart } = useContext(AppServiceStatus);
  const [serviceStatus, setServiceStatus] = useState(false);

  IPC.once("message", (_, data) => {
    const {isValid, message } = data;
    setServiceStatus(isValid)
  })

  return (
    <div className="main-body">
      {isServiceStart && (
        <div className="app-service d-flex justify-content-center">
          <div
            className={`card service-info mt-4 bgColor ${
              !serviceStatus ? "textColor" : "text-success"
            }`}
          >
            <div className="card-body">
              <h5 className="card-title text-body position-relative">
                Service status{" "}
                <span className="position-absolute" style={{right: "10px"}}>
                  {!serviceStatus ? (
                    <VsIcon.VscRefresh className="refresh" />
                  ) : (
                    <FaIcon.FaCheck className="ms-2 text-success" />
                  )}
                </span>
              </h5>
              <ul className="info-list py-2 ">
                <li className="">
                  <VsIcon.VscDebugDisconnect className="list-icon" />
                  {!serviceStatus ? (
                    <span>connecting with PKI.Network....</span>
                  ) : (
                    <span>Connected</span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/** Card Container */}
      <WorkingDir />
      {/* PKI.Network server address configure */}
      <div className="pki_address w-100 d-flex flex-column align-items-center">
        <Address />
      </div>

      {/* signature properties configure */}
      <DataLayer reducer={reducer} initialState={initialState}>
        <SignatureConfig />
      </DataLayer>
    </div>
  );
}
