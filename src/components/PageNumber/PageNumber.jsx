import React from "react";
import RadioGroup from "../shared/RadioGroup/RadioGroup";

import "./PageNumber.css";

const PageNumber = () => {
  const radioBtnItems = [
    { id: 1, type: "check", value: "First" },
    { id: 2, type: "check", value: "Last" },
    { id: 3, type: "check", value: "All" },
    { id: 4, type: "text", value: "custom" },
  ];

  const onChangehandle = (value) => {
    console.log(value);
  };

  return (
    <div className="page__number__selector mt-2 position-relative d-flex flex-column">
      <label id="page" className="position-absolute px-1 mb-1 text-white">Page</label>
      <div className="page__number mt-auto w-100 d-flex flex-row justify-content-center align-items-center">
        <RadioGroup items={radioBtnItems} onChangevalue={onChangehandle} />
      </div>
    </div>
  );
};

export default PageNumber;
