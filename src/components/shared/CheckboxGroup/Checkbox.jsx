import React, { useState, useEffect } from "react";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

import "./Checkbox.css";

const Checkbox = ({ lable, checkboxName, isChecked, onChange = (e) => {} }) => {
  const [visible, setVisible] = useState(isChecked);

  useEffect(() => {
    setVisible(isChecked);
  }, [isChecked]);

  const handleChange = ({ value }) => {
    console.log({ checkboxName, value });

    const TITEL =
      checkboxName === "enableLTV"
        ? "Long term validation"
        : checkboxName === "enableTimestamp"
        ? "Sign Timestamp"
        : checkboxName;

    if (
      (checkboxName === "enableLTV" && value) ||
      (checkboxName === "enableTimestamp" && value)
    ) {
      Confirm.show(
        TITEL,
        "If you ENABLE, it will take more time for signing.",
        "Enable",
        "Disable",
        () => {
          onChange({ name: checkboxName, value });
          setVisible(value);
        },
        () => setVisible(false),
        {
          borderRadius: "10px",
          messageColor: "#d69d85",
          backgroundColor: "#3b4252",
          titleFontSize: "18px",
        }
      );
    } else {
      onChange({ name: checkboxName, value });
      setVisible(value);
    }
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
