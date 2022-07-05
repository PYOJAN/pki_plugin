import React from "react";
import { VscSync } from "react-icons/vsc";

import "./Card.css";

export default function Card({ icon, name, dirPath, onChangeDir }) {
  return (
    <div className="__card position-relative d-flex flex-row align-items-center">
      {icon}

      <div className="card__body d-flex flex-column position-absolute justify-content-end p-2">
        <span className="text-capitalize">{name}</span>
        <small className="text-nowrap">{dirPath}</small>
      </div>

      <VscSync className="changeDir" onClick={(e) => onChangeDir(e, name)} />
    </div>
  );
}
