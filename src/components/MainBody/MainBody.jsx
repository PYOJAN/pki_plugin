import React, { useContext } from "react";
import WorkingDir from "../workingDirs/WorkingDir";
import Address from "../PkiAddress/Address";
import SignatureConfig from "../SignatureConfig/SignatureConfig";
import { DataLayer } from "../Contexts/DataLayer";
import reducer, { initialState } from "../Contexts/reducer";
import { AppServiceStatus } from "../../App";

import "./MainBody.css";

export default function MainBody() {
  const { isServiceStart } = useContext(AppServiceStatus);
  return (
    <div className="main-body">
      {isServiceStart && <div className="app-service d-flex justify-content-center align-items-center">
          Signing Service is runnig......
        </div>}
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
