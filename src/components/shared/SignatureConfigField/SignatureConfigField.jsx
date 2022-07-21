import React from "react";

import './SignatureConfigField.css';

const SignatureConfigField = ({
  children,
  className
}) => {
  return (
    <div className={`${className} input_fields mt-2 d-flex flex-row`}>
      {children}
    </div>
  );
};

export default SignatureConfigField;
