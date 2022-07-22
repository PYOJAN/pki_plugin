import React from "react";
import PageNumber from "../PageNumber/PageNumber";
import FormAllTextFields from "./FormAllTextFields";
// import SignatureConfigField from "../shared/SignatureConfigField/SignatureConfigField";
// import * as VsIcons from "react-icons/vsc";

import "./FormLeft.css";

const FormLeft = () => {
  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("form submit");
  // };

  return (
    <form className="w-100 h-100 p-1 pt-2">
      {/* Page Number Selection */}
      <PageNumber />
      <div className="coord_signBoxSize w-100 d-flex flex-column">
        {/* Signature config related fields */}
        <FormAllTextFields />
      </div>
    </form>
  );
};

export default FormLeft;
