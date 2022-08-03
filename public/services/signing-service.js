const { join, sep } = require("path");
const chokidar = require("chokidar");
const DB = require("./database");
const { XMLParser } = require("fast-xml-parser");
const pdfToBase64 = require("pdf-to-base64");
const { getXmlRequest } = require("./pki-xml-request");
const axios = require("axios");
const { writeFile, readFileSync } = require("fs");
const { moveSync } = require("fs-extra");
const pdfParse = require("pdf-parse");
const { dialog } = require("electron");

const XML_TO_JSON = new XMLParser();

// axios configration
const CONFIG = {
  headers: { "content-type": "text/xml" },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
};
let WATCHER = null;
let PDF_BASE64_DATA = null;
let PKI_ADDRESS = null;
let DIR_PATH_SOURCE = null;
let DIR_PATH_ORIGINAL = null;
let DIR_PATH_SIGNED = null;

/**
 * @description Startup Signing service
 */
const start = async () => {
  try {
    // Working dir info form DATABASE
    const dirInfo = await DB.findOne("directories");
    DIR_PATH_ORIGINAL = dirInfo.data.original.path;
    DIR_PATH_SIGNED = dirInfo.data.signed.path;

    // PKI address info form DATABASE
    const pkiInfo = await DB.findOne("pki");
    PKI_ADDRESS = pkiInfo.data.fullPkiUrl;

    // source PATH to be monitored
    DIR_PATH_SOURCE = join(
      dirInfo.data["source"].path,
      `${sep}${sep}**${sep}*.pdf`
    );
    /**
     * @description Strat waching SOURCE dir for PDF file only
     */
    WATCHER = chokidar.watch(DIR_PATH_SOURCE, {
      ignored: /(^|[\\])\../,
      persistent: true,
    });

    WATCHER.on("add", async (filePath, fileStat) => {
      if (fileStat) {
        PDF_BASE64_DATA = await pdfToBase64(filePath);

        // Sending file for signing
        generateXmlReqBeforeSendingToPkiForSign(PDF_BASE64_DATA, filePath);
      }
    });
  } catch (error) {
    console.log(
      `[ ${new Date().toLocaleDateString()} ]  ERROR: ${error.message}`,
      error.stack
    );
  }
};

/**
 *
 * @param {encodedPdfInBase64} encodedPdfInbase64
 * @description PDF in base64 encoded to get complete XML request.
 */
const generateXmlReqBeforeSendingToPkiForSign = async (
  encodedPdfInbase64,
  pdfPathToBeMove
) => {
  let pageNumber;
  let signedJSONResult;

  // getting user selected page from storage
  const signSettings = await DB.findOne("signature");
  const { page } = signSettings.data;
  // Reading PDF to calculate number of pages in PDF.
  const pdfInfo = await pdfParse(readFileSync(pdfPathToBeMove));

  const PAGE_TYPE =
    page === "First" || page === "Last" || !isNaN(page)
      ? "singlePage"
      : "multiPage";
  switch (PAGE_TYPE) {
    case "singlePage":
      // Setting page number to be sign acoording to user selection
      pageNumber =
        page === "First" ? 1 : page === "Last" ? pdfInfo.numpages : page;

      signedJSONResult = await postReqToPki(encodedPdfInbase64, pageNumber);

      const pageIsNotOutOfRange =
        signedJSONResult.error !== "Page number is out of range";
      if (signedJSONResult.status === "failed" && pageIsNotOutOfRange) {
        return dialog.showMessageBoxSync({
          message: signedJSONResult.error,
          type: "warning",
        });
      }

      pageIsNotOutOfRange &&
        filehandlingAfterSigning(signedJSONResult.data, pdfPathToBeMove);

      break;

    case "multiPage":
      let SIGNED_PDF = encodedPdfInbase64;
      for (let pageNum = 1; pageNum <= pdfInfo.numpages; pageNum++) {
        const signedJSONResult = await postReqToPki(SIGNED_PDF, pageNum);

        if (signedJSONResult.status === "failed") {
          return dialog.showMessageBoxSync({
            message: signedJSONResult.error,
            type: "warning",
          });
        }

        SIGNED_PDF = signedJSONResult.data;

        if (pdfInfo.numpages === pageNum) {
          filehandlingAfterSigning(SIGNED_PDF, pdfPathToBeMove);
        }
      }
      break;

    default:
      break;
  }
};

// saving saving file and moving signed file
const filehandlingAfterSigning = (SIGNED_DATA, pdfPathToBeMove) => {
  // extracting pdf file name from path
  const FILENAME = pdfPathToBeMove?.split("\\").pop().split("/").pop();

  try {
    // Files handle after signing
    writeFile(
      join(DIR_PATH_SIGNED, `${FILENAME.split(".")[0]}__signed.pdf`),
      SIGNED_DATA,
      { encoding: "base64" },
      (err) => {
        if (err) return console.log(err.message);

        moveSync(pdfPathToBeMove, join(DIR_PATH_ORIGINAL, FILENAME), {
          overwrite: true,
        });
      }
    );
  } catch (error) {
    // return dialog.showMessageBoxSync({
    //   message: error.message,
    //   type: "error",
    // });

    console.log(error);
  }
};

//
const postReqToPki = async (PDF_BASE64, pageNumber) => {
  try {
    const xmlReq = await getXmlRequest(PDF_BASE64, pageNumber);

    const signedRawResult = await axios.post(PKI_ADDRESS, xmlReq, CONFIG);
    const signedJSONResult = await XML_TO_JSON.parse(signedRawResult.data);

    const { status, error } = signedJSONResult.response;
    if (status === "failed") {
      return { status, error };
    } else if (signedJSONResult.response.data) {
      return signedJSONResult.response;
    }
  } catch (error) {
    return dialog.showMessageBoxSync({
      message: error.message,
      type: "warning",
    });
  }
};

const StopSigningService = () => {
  WATCHER.close().then(() => console.log("watcher stop"));
};

module.exports = {
  StartSigningService: start,
  StopSigningService,
};
