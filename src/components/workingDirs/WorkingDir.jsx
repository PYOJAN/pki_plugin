import React, { useState, useEffect } from "react";
import Card from "../shared/Card/Card";
import { VscFolder, VscFolderLibrary, VscFolderActive } from "react-icons/vsc";

import "./WorkingDir.css";
const IPC = window.electron.IPC;
const DIRS = "directories";

const initalDirData = [
  {
    isDefault: true,
    name: "source",
    icon: <VscFolderLibrary className="dirIcon" />,
  },
  {
    isDefault: true,
    name: "original",
    icon: <VscFolder className="dirIcon" />,
  },
  {
    isDefault: true,
    name: "signed",
    icon: <VscFolderActive className="dirIcon" />,
  },
];

const WorkingDir = () => {
  const [dirs, setDirs] = useState(initalDirData);

  useEffect(() => {
    const getDirs = async () => {
      const dirRawData = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA", DIRS);

      const direc = Object.values(dirRawData.data);

      const data = initalDirData.map((item, i) => {
        if (item.id === direc[i].id) {
          //merging two objects
          return Object.assign({}, item, direc[i]);
        }
      });

      setDirs(data);
    };

    getDirs();
  }, []);

  const handleChangeDir = (e, name) => {
    console.log(name);
  };

  return (
    <div className="card_container d-flex flex-column w-100 pt-3 p-1 pb-2">
      <h3>Working Directory</h3>

      {/** Cards */}
      <div className="cards d-flex flex-row w-100 align-items-center px-2">
        {dirs.map((dir) => (
          <Card
            key={dir.name}
            icon={dir.icon}
            name={dir.name}
            dirPath={dir.path}
            onChangeDir={handleChangeDir}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkingDir;
