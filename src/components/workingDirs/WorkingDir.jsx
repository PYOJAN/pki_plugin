import React from "react";
import Card from "../shared/Card/Card";
import { VscFolder, VscFolderLibrary, VscFolderActive } from "react-icons/vsc";

import './WorkingDir.css';

function WorkingDir() {
  return (
    <div className="card_container d-flex flex-column w-100 pt-3 p-1 pb-2">
      <h3>Working Directory</h3>

      {/** Cards */}
      <div className="cards d-flex flex-row w-100 align-items-center px-2">
        <Card
          icon={<VscFolderLibrary className="dirIcon" />}
          name="Source"
          dirPath="-path/of/folder"
        />
        <Card
          icon={<VscFolder className="dirIcon" />}
          name="Original"
          dirPath="-path/of/folder"
        />
        <Card
          icon={<VscFolderActive className="dirIcon" />}
          name="Signed"
          dirPath="-path/of/folder/fdfshfhsodfsdifosfofhofhsdfsdfh"
        />
      </div>
    </div>
  );
}

export default WorkingDir;
