import React, { useState, useEffect } from "react";
import Checkbox from "../shared/CheckboxGroup/Checkbox";
import SignatureConfigField from "../shared/SignatureConfigField/SignatureConfigField";
import { useDataLayerValue } from "../Contexts/DataLayer";
import CertList from "../Dropdown/Dropdown";
import { actionTypes } from "../Contexts/reducer";
import AppServiceHandle from "../AppServiceHadle/AppServiceHandle";

import "./FormRight.css";
import InputGroup from "../shared/InputGroup/InputGroup";

const FormRight = () => {
  const [initData, dispatch] = useDataLayerValue();
  const { enableLTV, enableTimestamp, isVisible, certs } = initData;
  const [linuxCertValue, setLinuxCertValue] = useState(certs);

  // console.log({ initData });

  useEffect(() => {
    setLinuxCertValue(certs);
  }, [certs]);

  const handleChangeValue = ({ name, value }) => {
    dispatch({
      type: actionTypes.UPDATE_SINGLE,
      field: name,
      value,
    });
  };

  const handleCertChange = (e) => {
    e.preventDefault();

    setLinuxCertValue({
      name: certs.name,
      sn: e.target.value,
    });
  };

  const saveCertvalue = () => {
    dispatch({
      type: actionTypes.UPDATE_SINGLE,
      field: "certs",
      value: linuxCertValue,
    });
  };
  const saveToDatabase = (e) => {
    if (e.key === "Enter" || e.key === "numEnter") {
      saveCertvalue();
    }
  };

  // Inline css
  const inputStyle = {
    backgroundColor: "rgb(59, 66, 82)",
    border: "1px solid transparent",
    color: "#B2C8DF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "30px!important",
  };

  return (
    <>
      <form className="w-100 pb-2 p-1 pt-1">
        {window.navigator?.platform.includes("Linux") ? (
          <SignatureConfigField>
            <InputGroup classes="w-100" feildLabel="Certificate Serial Number">
              <input
                type="text"
                className="form-control form-control-sm px-2"
                style={inputStyle}
                value={linuxCertValue.name === null ? "" : linuxCertValue.name}
                disabled={true}
              />
              <input
                type="text"
                className="form-control form-control-sm px-2"
                style={inputStyle}
                value={linuxCertValue.sn === null ? "" : linuxCertValue.sn}
                onChange={handleCertChange}
                onKeyDown={saveToDatabase}
              />
            </InputGroup>
          </SignatureConfigField>
        ) : (
          <SignatureConfigField>
            <CertList selectedCertificate={certs} dispatch={dispatch} />
          </SignatureConfigField>
        )}
        <SignatureConfigField>
          <Checkbox
            lable="LTV"
            checkboxName="enableLTV"
            isChecked={enableLTV}
            onChange={handleChangeValue}
          />
          <Checkbox
            lable="TimeStamp"
            checkboxName="enableTimestamp"
            isChecked={enableTimestamp}
            onChange={handleChangeValue}
          />
        </SignatureConfigField>
        <SignatureConfigField>
          <Checkbox
            lable="Signature Visible "
            checkboxName="isVisible"
            isChecked={isVisible}
            onChange={handleChangeValue}
          />
        </SignatureConfigField>
      </form>

      <div className="app_control w-100 mt-3 d-flex justify-content-center align-items-center rounded">
        <AppServiceHandle />
      </div>
    </>
  );
};

export default FormRight;
