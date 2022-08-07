import React from "react";
import { useDataLayerValue } from "../Contexts/DataLayer";
import { actionTypes } from "../Contexts/reducer";
import RadioGroup from "../shared/RadioGroup/RadioGroup";

import "./PageNumber.css";

const PageNumber = () => {
  const radioBtnItems = [
    { type: "check", value: "First" },
    { type: "check", value: "Last" },
    { type: "check", value: "All" },
    { type: "text", value: "custom" },
  ];

  const [initData, dispatch] = useDataLayerValue();

  const pageNumber = initData.page;

  const onChangehandle = (value) => {
    dispatch({
      type: actionTypes.UPDATE_SINGLE,
      field: "page",
      value,
    });
    // PAGE value saving to the database
    // IPC
  };
  
  return (
    <div className="page__number__selector mt-2 position-relative d-flex flex-column rounded">
      <label id="page" className="position-absolute px-1 mb-1 text-white">
        Page Number
      </label>
      <div className="page__number mt-auto w-100 d-flex flex-row justify-content-center align-items-center">
        <RadioGroup
          items={radioBtnItems}
          onChangevalue={onChangehandle}
          value={pageNumber}
        />
      </div>
    </div>
  );
};

export default PageNumber;
