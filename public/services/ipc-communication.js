const { app, dialog } = require("electron");
const getCertFromWindowsStore = require("./getCertFromWin");
const { join } = require("path");
const { platform, homedir } = require("os");
const DB = require("./database");

const { version } = require("../../package.json");
const isDev = !app.isPackaged;

/**
 *
 * @param {Object} ARG ARG value received from the rander process as { searchKey and DATA to be update }
 * @param {Object} WINDOWS Window value is actual electron window object
 * @returns Update value
 */
const updateData = async (ARG, WINDOWS) => {
  const { searchKey, data } = ARG;
  const mainWindow = WINDOWS;
  let updated;

  let path = join(homedir(), "Documents");
  updated = { data, searchKey };
  switch (searchKey) {
    case "pki":
      /**
       * @Handler for pki URL path configureation
       */
      updated = await DB.update(searchKey, data); // Finding data from database and updating
      break;
    case "directories":
      /**
       * @handler for working directories configration
       */
      const allDirsDetails = await DB.findOne(searchKey); // Getting Default Path
      const { source, original, signed } = allDirsDetails.data;
      const dirInfo = allDirsDetails.data[data];
      const fullPath = dirInfo === undefined ? null : dirInfo.path;

      if (fullPath !== null) {
        const isWin = platform() === "win32" ? "\\" : "/";
        const split = fullPath.split(isWin);
        path = split.slice(0, split.length - 2).join(isWin) + isWin;
      }

      /**
       *
       * @param {existPath} existPath Already saved path into database.
       * @param {selectedPath} selectedPath Current path selected by user
       * @returns it's return TRUE or FALSE
       * @description Check point to check path are not getting conficting
       */
      const isConflict = (existPath, selectedPath) => {
        const result = existPath === selectedPath ? false : true;
        return !result;
      };

      /**
       *
       * @param {conflictedWith} conflictedWith Provide the name of the one who is having conflict.
       * @returns it's return object with error massege
       */
      const conflictMessage = (conflictedWith) => {
        return {
          status: false,
          data: null,
          message: `Selected path already assign for ${conflictedWith.toUpperCase()}.`,
        };
      };
      // Selecting forlder
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
        buttonLabel: "Choose",
        defaultPath: path,
        title: `Choose folder for ${data.toUpperCase()}`,
      });

      // saving new folde path to the database
      if (!result.canceled) {
        const updatedDir = {
          ...allDirsDetails.data,
          [data]: {
            isDefault: false,
            name: data,
            path: result.filePaths[0],
          },
        };
        // Checking if selected path conflicting with others
        if (isConflict(source.path, result.filePaths[0])) {
          updated = conflictMessage(source.name);
        } else if (isConflict(original.path, result.filePaths[0])) {
          updated = conflictMessage(original.name);
        } else if (isConflict(signed.path, result.filePaths[0])) {
          updated = conflictMessage(signed.name);
        } else {
          updated = await DB.update(searchKey, updatedDir);
        }
      } else {
        // if user canceled
        updated = { status: false, data: null, message: "Cancel" };
      }
      break;
    case "signature":
      updated = await DB.update(searchKey, data); // Finding data from database and updating
      break;
    default:
      break;
  }

  return updated;
};

/**
 *
 * @param {ARG} ARG ARG value receive from render process to return data based on it.
 * @returns It's return configuration data for rander process.
 */
const getConfigData = async (ARG) => {
  // const PKI_URL = await DB.findOne('pki');
  if (ARG === "CERT") {
    const certs = await getCertFromWindowsStore();

    if (certs === null) { // setting cert value as empty if machine store is empty..
      const signatureDetails = await await DB.findOne("signature");
      await DB.update("signature", {
        ...signatureDetails,
        certs: {
          name: null,
          sn: null,
        },
      });
    }

    return platform() === "linux" ? { platform: platform() } : certs;
  }
  if (ARG !== "APPVERSION") {
    const allData = await DB.findAll();
    return allData.data;
  } else {
    return version;
  }
};

/**
 *
 * @param {eventType} eventType Window control command { hide }
 * @param {activeWindow} activeWindow active window object to manage.
 * @description This Fuction responsible for handling window controls ** Like window hide, show, close **
 */
const handleWindow = (eventType, activeWindow) => {
  switch (eventType) {
    case "hide":
      isDev ? activeWindow.hide() : app.quit();
      break;

    default:
      break;
  }
};

module.exports = {
  updateData,
  getConfigData,
  handleWindow,
};
