import React, { useState, useEffect, useRef } from "react";
import * as VsIcons from "react-icons/vsc";
import * as TbIcons from "react-icons/tb";

import "./Dropdown.css";
import { actionTypes } from "../Contexts/reducer";
const IPC = window.electron.IPC;

const CertList = ({ selectedCertificate, dispatch }) => {
  const [isOopen, setOpen] = useState(false);
  const [certificateList, setCertificateList] = useState([]);
  const [selectedCert, setSelectedCert] = useState("");
  const certEl = useRef(null);

  useEffect(() => {
    setSelectedCert(selectedCertificate);
  }, [selectedCertificate]);

  /**
   * @param CertsList Getting initial data from database
   */
  const getCerts = async () => {
    const allCert = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA", "CERT");

    setCertificateList(allCert);
  };

  // Handle certificate list show handle
  const handlePopUpShow = async (e) => {
    setOpen(!isOopen);

    await getCerts();
    certEl.current.style.top = !isOopen ? `50px` : `20px`;
  };

  const handlePopUpHide = async (cert) => {
    console.log({ cert });
    certEl.current.style.top = "20px";
    setOpen(false);

    const selectedCertificateIs = { name: cert.name, sn: cert.sn };

    setSelectedCert(selectedCertificateIs);

    dispatch({
      type: actionTypes.UPDATE_SINGLE,
      field: "certs",
      value: { ...selectedCertificateIs },
    });
  };

  return (
    <div className="cert_dropDown w-100 h-100 position-relative d-flex flex-column">
      <strong className="form-label d-block text-white">Select Cert</strong>
      <div
        className="select_cert w-100 bg-primary text-white rounded d-flex flex-row justify-content-between align-items-center px-2"
        onClick={(e) => handlePopUpShow(e)}
      >
        <span className="selected px-2">
          {" "}
          <TbIcons.TbCertificate
            className="text-white pt-0"
            style={{ fontSize: "1.2rem" }}
          />
          <span
            className="px-2 text-uppercase text-nowrap"
            style={{ fontSize: "0.7rem", textOverflow: "ellipsis" }}
          >
            {selectedCert.sn !== "user_prompt"
              ? `${selectedCert.name} ( sn: ${selectedCert.sn} )`
              : "Select Certificate"}
          </span>
        </span>
        {isOopen ? <VsIcons.VscTriangleUp /> : <VsIcons.VscTriangleDown />}
      </div>

      <ul
        className={`cert_items ${
          isOopen && "popup"
          // "popup"
        } position-absolute w-100 p-1 d-flex flex-column rounded`}
        ref={certEl}
      >
        <li
          className={`${
            selectedCert.sn === "user_prompt" && "selected-cert"
          } p-1 rounded text-white text-uppercase`}
          onClick={(e) =>
            handlePopUpHide({ name: "User Prompt", sn: "user_prompt" })
          }
        >
          User Prompt
        </li>
        {certificateList.map((cer) => (
          <li
            key={cer.sn}
            className={`${
              cer.sn === selectedCert.sn && "selected-cert"
            } p-1 rounded text-white text-uppercase`}
            onClick={(e) => handlePopUpHide(cer)}
          >
            {`${cer.name} ( SN: ${cer.sn} )`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertList;
