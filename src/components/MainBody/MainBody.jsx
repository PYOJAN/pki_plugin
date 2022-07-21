import React from "react";
import WorkingDir from "../workingDirs/WorkingDir";
import Address from "../PkiAddress/Address";
import SignatureConfig from "../SignatureConfig/SignatureConfig";
import { DataLayer } from "../Contexts/DataLayer";
import reducer, { initialState } from "../Contexts/reducer";

import "./MainBody.css";

export default function MainBody() {

  return (
    <div className="main-body">
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
