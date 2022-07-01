import { useContext } from "react";
import { FormContext } from "../Form/Form";
import "./Input.css";

function Input(props) {
  const { label, type = "text", name, className, isdisable } = props;

  const formContext = useContext(FormContext);
  const { form, handleFormChange } = formContext;

  return (
    <>
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name}
        className={className}
        value={form[name]}
        onChange={handleFormChange}
        disabled={isdisable}
      />
    </>
  );
}

export default Input;
