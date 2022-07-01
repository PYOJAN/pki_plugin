import React, { useState } from "react";
import Form from "../shared/Form/Form";
import Input from "../shared/Input/Input";

import "./Address.css";

function Address() {
  const [disable, setDisable] = useState(true);

  const initialValues = {
    machineIP: "http://192.168.1/",
    port: "1620",
  };
  const handlePkiAddress = (e) => {
    e.preventDefault();

    setDisable(!disable);

    console.log(initialValues);
  };

  return (
    <>
      <Form
        className="w-50 d-flex justify-content-center flex-column"
        initialValues={initialValues}
        submit={() => {alert(`form name`)}}
      >
        <span className="text-white font-weight-bold mb-1">Machine IP</span>
        <div className="input-group input-group-sm w-100 ">
          <Input
            type="text"
            className="form-control form-control-sm machine-ip"
            name="machineIP"
            isdisable={disable}
          />
          <Input
            type="text"
            className="form-control form-control-sm port"
            name="port"
            isdisable={disable}
          />
          
        </div>
      </Form>
    </>
  );
}

export default Address;
