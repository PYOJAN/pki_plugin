import React, { useState, createContext } from "react";
import "./Form.css";

export const FormContext = createContext({
  form: {},
});

function Form(props) {
  const { children, initialValues, submit = () => {}, className } = props;

  const [form, setForm] = useState(initialValues);

  const handleFormChange = (event) => {
    // Get the name of the field that caused this change event
    // Get the new value of this field
    const { name, value } = event.target;

    // Update state
    // Assign new value to the appropriate form field
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submit(form)
  }

  return (
    <FormContext.Provider
      value={{
        form,
        handleFormChange,
      }}
    >
      <form className={className}>
        {children}
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          onClick={(e) => handleFormSubmit(e)}
        >
          ok
        </button>
      </form>
    </FormContext.Provider>
  );
}

export default Form;
