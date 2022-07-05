import React, { useState, useEffect } from "react";
import { MdEdit, MdCheck } from "react-icons/md";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import "./Address.css";

Notify.init({
  // width: "300px",
  distance: "20px",
  cssAnimation: true,
  position: "right-bottom",
  closeButton: false,
});

const IPC = window.electron.IPC;
const ADDRESS = "pki";

const Address = () => {
  const [isEditable, setEditable] = useState(true);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const getDirs = async () => {
      const pkiAddress = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA", ADDRESS);

      setValues(pkiAddress.data);
    };
    getDirs();
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const editAndSaveNewData = async (e) => {
    setEditable(!isEditable);

    if (!isEditable) {
      Confirm.show(
        "Save new setting",
        "Do you want to save?",
        "Save",
        "Cancel",
        async () => {
          const isSaved = await IPC.ipcInvoke(
            "EVENT:INVOCKE:FOR:UPDATE:SETTING",
            {
              searchKey: ADDRESS,
              data: values,
            }
          );
          if (isSaved) Notify.success("PKI Setting update successfully.");
        },
        () => {
          Notify.warning("Operation Canceled.");
        },
        {}
      );
    }
  };

  return (
    <div className="pki__address_form w-50">
      <label className="fw-bold text-white">PKI Address</label>
      <div className="input-group input-group-sm">
        {Object.values(values).map((value, i) => (
          <Input
            key={i}
            value={value}
            isEditable={isEditable}
            onHandleChange={handleChange}
          />
        ))}
        <button
          className={`btn btn-sm ${isEditable ? "btn-primary" : "bg-success"}`}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          onClick={(e) => editAndSaveNewData(e)}
        >
          {isEditable ? <MdEdit /> : <MdCheck />}
        </button>
      </div>
    </div>
  );
};

const Input = ({ value, isEditable, onHandleChange }) => {
  const isValidURL = (url) => {
    return url.indexOf("http://") === 0 || url.indexOf("https://") === 0
      ? true
      : false;
  };

  return (
    <input
      type="text"
      name={isValidURL(value) ? "url" : "port"}
      value={value}
      className={`form-control form-control-sm ${isEditable ? "disable" : ""}`}
      disabled={isEditable}
      onChange={(e) => onHandleChange(e)}
    />
  );
};

export default Address;
