import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import PageNumber from "../PageNumber/PageNumber";
import Input from "../shared/Input/Input";
import InputGroup from "../shared/InputGroup/InputGroup";
import SignatureConfigField from "../shared/SignatureConfigField/SignatureConfigField";

import "./FormLeft.css";

const FormLeft = () => {
  return (
    <form className="w-100 h-100 p-1 pt-2">
      {/* Page Number Selection */}
      <PageNumber />
      {/* Signature config related fields */}
      <div className="coord_signBoxSize w-100 d-flex flex-column">
        <SignatureConfigField>
          <InputGroup feildLabel="Coordinate">
            <Input type="text" placeholder="CoordX" />
            <Input type="text" placeholder="CoordY" />
          </InputGroup>
          <InputGroup feildLabel="Sign Box Size">
            <Input type="text" placeholder="Width" />
            <Input type="text" placeholder="Height" />
          </InputGroup>
        </SignatureConfigField>
        <SignatureConfigField>
          <InputGroup feildLabel="Location">
            <Input type="text" placeholder="e.g Delhi" />
          </InputGroup>
          <InputGroup feildLabel="Reason">
            <Input type="text" placeholder="e.g Invoice Approve" />
          </InputGroup>
        </SignatureConfigField>
        <SignatureConfigField>
          <InputGroup feildLabel="Date Formate">
            <Input
              type="text"
              placeholder="dd-MMM-yyyy hh:mm tt"
              isDisabled={true}
            />
          </InputGroup>
          <InputGroup feildLabel="Custome Text">
            <Input type="text" placeholder="Your Custome Test" />
          </InputGroup>
        </SignatureConfigField>
        <SignatureConfigField>
          <Dropdown />
        </SignatureConfigField>
      </div>
    </form>
  );
};

export default FormLeft;
