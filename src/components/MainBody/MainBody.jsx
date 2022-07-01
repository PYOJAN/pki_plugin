import React from "react";
import WorkingDir from "../workingDirs/WorkingDir";
import Address from "../PKI/Address";

import "./MainBody.css";

export default function MainBody() {
  return (
    <div className="main-body">
      {/** Card Container */}
      <WorkingDir />

      <div className="pki_address w-100 d-flex align-items-center justify-content-center">
        <Address />
      </div>
    </div>
  );
}
