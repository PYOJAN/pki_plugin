import React from "react";
import FormLeft from "../Forms/FormLeft";
import FormRight from "../Forms/FormRight";

import "./SignatureConfig.css";

const SignatureConfig = () => {
  return (
    <div className="signature__config container-fluid">
      <div className="row row-col-2 h-100 position-relative">
        <div className="col h-100 pt-1 pb-2">
          <FormLeft />
        </div>
        <div className="d-flex flex-column col h-100 pb-2" style={{gap: "5px"}}>
          <FormRight />
        </div>
      </div>
    </div>
  );
};

export default SignatureConfig;
