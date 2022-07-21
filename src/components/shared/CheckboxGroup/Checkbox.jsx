import React, { useState, useEffect } from "react";
import "./Checkbox.css";

const Checkbox = ({ lable, checkboxName, isChecked, onChange = (e) => {} }) => {
  const [visible, setVisible] = useState(isChecked);

  useEffect(() => {
    setVisible(isChecked);
  }, [isChecked]);

  const handleChange = ({ value }) => {
    onChange({ name: checkboxName, value });
    setVisible(value);
  };

  return (
    <div className="input_checkbox_group d-flex flex-column w-50">
      <strong className="m-0 p-0 text-white">{lable}</strong>
      <div className="input_checkbox_item py-1 d-flex flex-row align-items-center justify-content-center rounded">
        <label htmlFor="ltv" className="mb-0 px-1 text-danger">
          Disable
        </label>
        <input
          type="checkbox"
          className=""
          name={checkboxName}
          id={checkboxName}
          checked={visible}
          value={visible}
          onChange={(e) => handleChange({ value: !visible })}
        />
        <label htmlFor="ltv" className="mb-0 px-1 text-success">
          Enable
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
