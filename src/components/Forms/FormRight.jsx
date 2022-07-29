import React from "react";
import Checkbox from "../shared/CheckboxGroup/Checkbox";
import SignatureConfigField from "../shared/SignatureConfigField/SignatureConfigField";
import { useDataLayerValue } from "../Contexts/DataLayer";

import "./FormRight.css";
import CertList from "../Dropdown/Dropdown";
import { actionTypes } from "../Contexts/reducer";
import AppServiceHandle from "../AppServiceHadle/AppServiceHandle";

const FormRight = () => {
  const [initData, dispatch] = useDataLayerValue();
  const { enableLTV, enableTimestamp, isVisible, certs } = initData;

  const handleChangeValue = ({ name, value }) => {
    dispatch({
      type: actionTypes.UPDATE_SINGLE,
      field: name,
      value,
    });
  };

  return (
    <>
      <form className="w-100 pb-2 p-1 pt-1">
        <SignatureConfigField>
          <CertList selectedCertificate={certs} dispatch={dispatch} />
        </SignatureConfigField>
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
