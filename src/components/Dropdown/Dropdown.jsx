import React, { useState, useRef } from "react";
import * as VsIcons from "react-icons/vsc";
import * as TbIcons from "react-icons/tb";

import "./Dropdown.css";

const Dropdown = () => {
  const [isOopen, setOpen] = useState(false);
  const certEl = useRef(null);

  const handlePopUpShow = (e) => {
    setOpen(!isOopen);

    const individualCertElHeight = certEl.current.clientHeight;
    certEl.current.style.top = !isOopen
      ? `-${individualCertElHeight - 10}px`
      : `0px`;
  };

  const handlePopUpHide = (e) => {
    setOpen(false);
    certEl.current.style.top = "0";
  };

  return (
    <div className="cert_dropDown w-100 h-100 position-relative d-flex flex-column">
      <strong className="form-label d-block text-white">Select Cert</strong>
      <div
        className="select_cert w-100 bg-danger text-white rounded d-flex flex-row justify-content-between align-items-center px-2"
        onClick={(e) => handlePopUpShow(e)}
      >
        <span className="selected px-2">
          {" "}
          <TbIcons.TbCertificate
            className="text-white me-3"
            style={{ fontSize: "1.2rem" }}
          />{" "}
          DS Test 16
        </span>
        {isOopen ? <VsIcons.VscTriangleUp /> : <VsIcons.VscTriangleDown />}
      </div>

      <ul
        className={`cert_items ${
          isOopen && "popup"
        } position-absolute w-100 p-1 d-flex flex-column rounded`}
        ref={certEl}
      >
        <li
          className="p-1 rounded text-white"
          onClick={(e) => handlePopUpHide(e)}
        >
          DS Test 1
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
