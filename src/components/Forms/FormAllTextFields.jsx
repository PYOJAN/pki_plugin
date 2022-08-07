import React from "react";
import { useDataLayerValue } from "../Contexts/DataLayer";
import Input from "../shared/Input/Input";
import InputGroup from "../shared/InputGroup/InputGroup";
import SignatureConfigField from "../shared/SignatureConfigField/SignatureConfigField";
import { actionTypes } from "../Contexts/reducer";

const FormAllTextFields = () => {
  const [initData, dispatch] = useDataLayerValue();
  const { coord, size, customText, reason, location, dateFormat } = initData;

  /**
   *
   * @param {inputValue} number
   * @param {name} string
   * @param {valueFor} string
   * @Discreption This function on for COORD, SIZE
   */
  const handleCoordAndSize = ({ inputValue, name, valueFor }) => {
    dispatch({
      type:
        name === "coord" || name === "size"
          ? actionTypes.UPDATE_OBJECT
          : actionTypes.UPDATE_SINGLE,
      field: name,
      valueFor,
      value: inputValue,
    });
  };
  return (
    <>
      <SignatureConfigField>
        <InputGroup feildLabel="Coordinate [ X | Y ]">
          <Input
            type="text"
            name="coord"
            fieldFor="coord-x"
            inputValue={coord.x}
            placeholder="CoordX"
            onHandleChangevalue={handleCoordAndSize}
          />
          <Input
            type="text"
            name="coord"
            fieldFor="coord-y"
            inputValue={coord.y}
            placeholder="CoordY"
            onHandleChangevalue={handleCoordAndSize}
          />
        </InputGroup>
        <InputGroup feildLabel="Sign Box Size [ W | H ]">
          <Input
            type="text"
            name="size"
            fieldFor="size-height"
            inputValue={size.height}
            placeholder="Width"
            onHandleChangevalue={handleCoordAndSize}
          />
          <Input
            type="text"
            name="size"
            fieldFor="size-width"
            inputValue={size.width}
            placeholder="height"
            onHandleChangevalue={handleCoordAndSize}
          />
        </InputGroup>
      </SignatureConfigField>
      <SignatureConfigField>
        <InputGroup feildLabel="Location">
          <Input
            type="text"
            name="location"
            inputValue={location !== null ? location : ""}
            placeholder="e.g Delhi"
            onHandleChangevalue={handleCoordAndSize}
          />
        </InputGroup>
        <InputGroup feildLabel="Reason">
          <Input
            type="text"
            name="reason"
            inputValue={reason ? reason : ""}
            placeholder="e.g Invoice Approve"
            onHandleChangevalue={handleCoordAndSize}
          />
        </InputGroup>
      </SignatureConfigField>
      <SignatureConfigField>
        {/* <InputGroup feildLabel="Date Format">
          <Input
            type="text"
            inputValue={dateFormat[0]}
            placeholder="dd-MMM-yyyy hh:mm tt"
            isDisabled={true}
          />
        </InputGroup> */}
        <InputGroup classes="w-100" feildLabel="Custome Text">
          <Input
            type="text"
            name="customText"
            inputValue={customText ? customText : ""}
            placeholder="Your Custome Test"
            onHandleChangevalue={handleCoordAndSize}
          />
        </InputGroup>
      </SignatureConfigField>
    </>
  );
};

export default FormAllTextFields;
