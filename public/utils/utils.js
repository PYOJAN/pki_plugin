const DB = require("../services/database");

/**
 *
 * @returns {isValid, message}
 * @description returning true or false value in isValid and related message
 */
const checkConfig = async () => {
  const configs = await await (await DB.findAll()).data;

  const { directories, signature, pki } = configs;

  // Checking directory path is not null
  if (directories?.source?.path === null || directories?.source?.path === "")
    return { isValid: false, message: "Plase select folder path for SOURCE" };
  else if (
    directories?.original?.path === null ||
    directories?.original?.path === ""
  )
    return { isValid: false, message: "Plase select folder path for ORIGINAL" };
  else if (
    directories?.signed?.path === null ||
    directories?.signed?.path === ""
  )
    return { isValid: false, message: "Plase select folder path for SIGNED" };

  // Checking signature related configs
  if (pki?.fullPkiUrl === null || pki?.fullPkiUrl === "")
    return { isValid: false, message: "Plase provide PKI address for signing" };
  if (signature?.certs.sn === null || signature?.certs.sn === "")
    return { isValid: false, message: "Plase provide certifcate by selecting certificate or entering certificate serial number." };

  return { isValid: true, message: "Config are valid." };
};

const UUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

module.exports = {
  UUID,
  checkConfig,
};
