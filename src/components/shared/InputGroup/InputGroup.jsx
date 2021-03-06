import React from "react";

const InputGroup = ({ feildLabel, children, classes = "noclass" }) => {
  return (
    <div className={`${classes} input_field`}>
      <strong className="form-label d-block text-white">{feildLabel}</strong>
      <div className="input-group input-group-sm">{children}</div>
    </div>
  );
};

export default InputGroup;
