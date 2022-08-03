import React, { useState, useEffect } from "react";
import * as VsIcons from "react-icons/vsc";
import * as TbIcons from "react-icons/tb";
import toast from "react-hot-toast";

import "./Dropdown.css";
import { actionTypes } from "../Contexts/reducer";
const IPC = window.electron.IPC;

const CertList = ({ selectedCertificate, dispatch }) => {
  const [showCertList, setShowCertList] = useState(false);
  const [selectedCert, setSelectedCert] = useState({ name: null, sn: null });
  const [certificateListFromMachin, setCertificateListFromMachin] = useState(
    []
  );

  // Updating certificate list from DB
  useEffect(() => {
    setSelectedCert(selectedCertificate);
  }, [selectedCertificate]);

  /**
   * @param CertsList Getting initial data from database
   */
  const getCertificateFromMachine = async () => {
    const allCert = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA", "CERT");
    if (allCert === null) return null; // if no certificate available in machine
    setCertificateListFromMachin(allCert);
  };

  // Handle show hide certificate list
  const handleShowCertList = async (e) => {
    e.preventDefault();
    let isCertAvailableInMachine;
    isCertAvailableInMachine =
      !showCertList && (await getCertificateFromMachine());

    if (isCertAvailableInMachine === null) {
      setSelectedCert({ name: null, sn: null });
      return toast.error("Certificate not found");
    }

    setShowCertList(!showCertList);
  };

  // Handle hide certificate list popup
  const handleHideCertList = (SELECTED_CERT) => {
    const { name, sn } = SELECTED_CERT;
    setSelectedCert({ name, sn });
    setShowCertList(false); // hidel dropdown list

    dispatch({
      type: actionTypes.UPDATE_SINGLE,
      field: "certs",
      value: { name, sn },
    });
  };

  return (
    <div className="cert_dropDown w-100 h-100 position-relative d-flex flex-column">
      <strong className="form-label d-block text-white">Select Cert</strong>
      <button
        className="select_cert w-100 btn btn-sm btn-primary text-white rounded d-flex flex-row justify-content-between align-items-center px-2"
        onClick={(e) => handleShowCertList(e)}
      >
        <span className="selected px-2">
          <TbIcons.TbCertificate
            className="text-white pt-0"
            style={{ fontSize: "1.2rem" }}
          />
          <span
            className="px-2 text-uppercase text-nowrap"
            style={{ fontSize: "0.7rem", textOverflow: "ellipsis" }}
          >
            {selectedCert.name !== null
              ? `${selectedCert.name} ( ${selectedCert.sn} )`
              : "Select Certificate"}
          </span>
        </span>
        {true ? <VsIcons.VscTriangleUp /> : <VsIcons.VscTriangleDown />}
      </button>

      <ul
        className={`${
          showCertList && "popup"
        } cert_items position-absolute w-100 py-1 d-flex flex-column rounded`}
      >
        {certificateListFromMachin &&
          certificateListFromMachin.map((cer) => (
            <li
              key={cer.sn}
              className={` px-2 py-1 rounded text-white text-uppercase`}
              onClick={(e) => handleHideCertList(cer)}
            >
              {`${cer.name} ( SN: ${cer.sn} )`}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CertList;
