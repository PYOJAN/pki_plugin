const { UUID } = require("../utils/utils");
const DB = require("./database");

const getXmlRequest = async (base64Data, pageNumber) => {
  const {
    coord,
    size,
    certs,
    location,
    reason,
    customText,
    isVisible,
    enableTimestamp,
    enableLTV,
  } = await (
    await DB.findAll()
  ).data.signature;

  return new Promise(async (resolve, reject) => {
    let xmlRequest;
    try {
      xmlRequest = `<request>
          <command>pkiNetworkSign</command>
          <ts></ts>
          <txn>${UUID()}</txn>
          <certificate>
              <attribute name='CN'></attribute>
              <attribute name='O'></attribute>
              <attribute name='OU'></attribute>
              <attribute name='T'></attribute>
              <attribute name='E'></attribute>
              <attribute name='SN'>${
                certs.sn !== "user_prompt" ? certs.sn : ""
              }</attribute>
              <attribute name='CA'></attribute>
              <attribute name='TC'>SG</attribute>
              <attribute name='AP'>1</attribute>
          </certificate>
          <file>
              <attribute name='type'>pdf</attribute>
              <attribute name='inputfile'></attribute>
              <attribute name='outputfile'></attribute>
          </file>
          <pdf>
              <page>${pageNumber}</page>
              <cood>${coord.x},${coord.y}</cood>
              <size>${size.height},${size.width}</size>
              <enableltv>${enableLTV ? "YES" : "NO"}</enableltv>
              <invisiblesign>${isVisible ? "NO" : "YES"}</invisiblesign>
              <enabletimestamp>${
                enableTimestamp ? "YES" : "NO"
              }</enabletimestamp>
              <location>${location ? location : ""}</location>
              <reason>${reason ? reason : ""}</reason>
              <dateformat>dd-MMM-yyyy hh:mm tt</dateformat>
              <customtext>${customText ? customText : ""}</customtext>
          </pdf>
          <data>
            ${encodeURIComponent(base64Data)}
          </data>
        </request>`;
    } catch (err) {
      reject(err);
    } finally {
      resolve(xmlRequest);
    }
  });
};

module.exports = { getXmlRequest };

// <data>${encodeURIComponent(base64Data)}</data>
