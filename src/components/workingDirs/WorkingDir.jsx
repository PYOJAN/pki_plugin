import React, { useState, useEffect } from "react";
import Card from "../shared/Card/Card";
import { VscFolder, VscFolderLibrary, VscFolderActive } from "react-icons/vsc";
import toast from 'react-hot-toast';

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

  /**
   *
   * @param {Object} initalDirData copy of the dir object like data
   * @param {Object} dirRawData directory data from database
   * @returns merged new Object
   */
  const mergeObject = (initalDirData, dirRawData) => {
    let mergedData;
    const direc = Object.values(dirRawData);
    mergedData = initalDirData.map((item, i) => {
      let newObject;
      if (item.id === direc[i].id) {
        newObject = Object.assign({}, item, direc[i]);
      }
      return newObject;
    });
    return mergedData;
  };

  /**
   * @param UseEffect Getting initial data from database in startup
   */
  useEffect(() => {
    const getDirs = async () => {
      const dirRawData = await IPC.ipcInvoke("EVENT:INVOCKE:GET:DATA", DIRS);
      const data = mergeObject(initalDirData, dirRawData.directories);
      setDirs(data);
    };

    getDirs();
  }, []);

  const handleChangeDir = async (e, name) => {
    const toBeUpdate = { searchKey: "directories", data: name };
    const newDirs = await IPC.ipcInvoke(
      "EVENT:INVOCKE:UPDATE:DATA",
      toBeUpdate
    );
    const { status, data } = newDirs;
    if (status) {
      const newUpdateDirs = mergeObject(initalDirData, data);
      setDirs(newUpdateDirs);

      toast.success(`New path set for ${name}`);
    } else {
      toast.error(`New Path not set for ${name}`)
    }
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
      {/* <Toaster /> */}
    </div>
  );
};

export default WorkingDir;
