import React, { useState } from "react";

const Input = ({ type, onHandleChangevalue = (e) => {}, placeholder, isDisabled }) => {
  const [value, setvalue] = useState();

  const handleChannge = (_value) => {
    setvalue(_value);
    onHandleChangevalue(_value)
  };
  return (
    <>
      <input
        type={type}
        value={value}
        className="form-control form-control-sm"
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(e) => handleChannge(e.tager.value)}
      />
    </>
  );
};

export default Input;
