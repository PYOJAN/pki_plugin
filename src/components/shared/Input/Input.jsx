import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Input = ({
  type,
  name,
  fieldFor,
  inputValue,
  onHandleChangevalue = (e) => {},
  placeholder,
  isDisabled,
}) => {
  const [initValue, setInitValue] = useState(inputValue);
  const [timer, setTimer] = useState(null);
  const valueFor = (fieldFor && fieldFor.split("-").pop()) || null;

  // Updating private state from database if [inputvalue] props is changes
  useEffect(() => {
    setInitValue(inputValue);
  }, [inputValue]);

  const handleChannge = (e) => {
    const _value = e.target.value;
    const isNumber = !isNaN(+_value) && (name === "coord" || name === "size");
    const isString =
      name === "location" || name === "reason" || name === "customText";
      
    const errorMsg = () => toast.error("CARACTER is not allowed.");

    // Updating private state
    isNumber ? setInitValue(_value) : !isString && errorMsg();
    isString && setInitValue(_value);

    // Updating database if user stope typing few second
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      // Only numeric value is allowed.
      if (isNumber)
        onHandleChangevalue({ inputValue: +_value, name, valueFor });

      if (isString) onHandleChangevalue({ inputValue: _value, name, valueFor });
    }, 500);

    setTimer(newTimer);
  };

  // Inline css
  const inputStyle = {
    backgroundColor: "rgb(59, 66, 82)",
    border: "1px solid transparent",
    color: isDisabled ? "#495C83" : "#B2C8DF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <>
      <input
        type={type}
        value={initValue}
        className="form-control form-control-sm px-2"
        style={inputStyle}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(e) => handleChannge(e)}
      />
    </>
  );
};

export default Input;
