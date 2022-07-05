import React from "react";
import WorkingDir from "../workingDirs/WorkingDir";
import Address from "../PkiAddress/Address";

import "./MainBody.css";

export default function MainBody() {
  return (
    <div className="main-body">
      {/** Card Container */}
      <WorkingDir />

      <div className="pki_address w-100 d-flex flex-column align-items-center">
        <Address />
      </div>
    </div>
  );
}
