const { dialog } = require("electron");
const DB = require("../services/database");
const axios = require("axios");
const { getXmlRequest } = require("../services/pki-xml-request");
const { XMLParser } = require("fast-xml-parser");
const XML_TO_JSON = new XMLParser();

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
    return {
      isValid: false,
      message:
        "Plase provide certifcate by selecting certificate or entering certificate serial number.",
    };

  // if PKI.Ntwork is runing on the provided PORT number.
  const { status, error } = await await postReqToPki("pdf", 1, pki.fullPkiUrl);
  if (status === "ERROR") {
    return {
      isValid: false,
      message: error,
    };
  }

  return { isValid: true, message: "Config are valid." };
};

// API call
// axios configration
const CONFIG = {
  headers: { "content-type": "text/xml" },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
};
const postReqToPki = async (
  PDF_BASE64,
  pageNumber,
  PKI_ADDRESS,
  timeout = 1000 * 60
) => {
  try {
    const xmlReq = await getXmlRequest(PDF_BASE64, pageNumber);

    const signedRawResult = await axios.post(PKI_ADDRESS, xmlReq, {
      ...CONFIG,
      timeout,
    });
    const signedJSONResult = await XML_TO_JSON.parse(signedRawResult.data);

    const { status, error } = signedJSONResult.response;
    if (status === "failed") {
      return { status, error };
    } else if (signedJSONResult.response.data) {
      return signedJSONResult.response;
    }
  } catch (error) {
    return {
      status: "ERROR",
      errorMessage: error.message,
      error: `PKI.Network is not runing on ${PKI_ADDRESS}`,
      errorCode: error.code,
    };
  }
};

module.exports = {
  checkConfig,
  postReqToPki,
};
