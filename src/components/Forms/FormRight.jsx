import React from "react";
import Checkbox from "../shared/CheckboxGroup/Checkbox";
import SignatureConfigField from "../shared/SignatureConfigField/SignatureConfigField";

import "./FormRight.css";

const FormRight = () => {
  return (
    <>
      <form className="w-100 pb-2 p-1 pt-1">
        <SignatureConfigField>
          <Checkbox checkboxName="LTV" />
          <Checkbox checkboxName="TimeStamp" />
        </SignatureConfigField>
        <SignatureConfigField>
          <Checkbox checkboxName="Signature Visibility" />
        </SignatureConfigField>
      </form>

      <div className="app_control w-100 mt-3">
        <button className="btn btn-primary"></button>
      </div>
    </>
  );
};

export default FormRight;
