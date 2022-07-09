import React from "react";
import "./Checkbox.css";

const Checkbox = ({checkboxName}) => {
  return (
    <div className="input_checkbox_group d-flex flex-column w-50">
      <strong className="m-0 p-0 text-white">{checkboxName}</strong>
      <div className="input_checkbox_item py-1 d-flex flex-row align-items-center justify-content-center rounded">
        <label htmlFor="ltv" className="mb-0 px-1 text-danger">
          Disable
        </label>
        <input type="checkbox" className="mx-2" name="ltv" id="ltv" />
        <label htmlFor="ltv" className="mb-0 px-1 text-success">
        Enable
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
