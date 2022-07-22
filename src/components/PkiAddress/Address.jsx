import React, { useState, useEffect, useMemo } from "react";
import * as MdIcons from "react-icons/md";
import * as FaIcon from "react-icons/fa";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import toast from "react-hot-toast";

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
  const [isEditable, setIsEditable] = useState(true);
  const [values, setValues] = useState("");

  useEffect(() => {
    const getDirs = async () => {
      const pkiAddress = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA", ADDRESS);
      setValues(pkiAddress.pki.fullPkiUrl);
    };
    getDirs();
  }, []);

  // Handle saving and edit data
  const handleEditAndSave = () => {
    const ipcHandle = async () => {
      const savingResult = await IPC.ipcInvoke("EVENT:INVOCKE:UPDATE:DATA", {
        searchKey: ADDRESS,
        data: { fullPkiUrl: values },
      });

      const { status } = savingResult;

      if (status) {
        toast.success(`New PKI Address saved. \n${values}`);
      }
    };

    !isEditable && ipcHandle();

    //
    setIsEditable(!isEditable);
  };

  // Monitor value is valid URL or not
  const isValid = useMemo(() => {
    const regex =
      /^((https?:\/\/)|(www.))(?:([a-zA-Z0-9]+)|(\d+\.\d+.\d+.\d+)):\d{2,4}$/gm;
    const result = regex.test(values);

    return result;
  }, [values]);

  return (
    <div className="pki__address_form w-50">
      <label className="text-white" style={{ fontWeight: "bold" }}>
        PKI Address
      </label>
      <div className="input-group input-group-sm">
        <input
          type="text"
          name="fullPkiUrl"
          value={values}
          className={`form-control form-control-sm ${!isValid ? "error" : ""} ${
            isEditable ? "disable" : "allowed"
          }`}
          disabled={isEditable}
          onChange={(e) => setValues(e.target.value)}
        />
        <button
          className={`${
            isEditable ? "btn-primary" : "btn-success"
          } pkiAddressSaveBtn btn btn-sm rounded-0 ${!isValid && "btn-danger"}`}
          onClick={() =>
            !isValid ? toast.error("Invalid PKI URL") : handleEditAndSave()
          }
        >
          {isEditable ? <MdIcons.MdModeEdit /> : <FaIcon.FaCheck />}
        </button>
      </div>
    </div>
  );
};

export default Address;
