const { UID } = require("../utils/utils");
const pdf2base64 = require("pdf-to-base64");
const DB = require("./database");

const getXmlRequest = async (filePath) => {
  const { signature, certs } = await DB.findAll();
  const { page, coord, size, isVisible, enableLTV, enabletimestamp } =
    signature;

  return new Promise(async (resolve, reject) => {
    let xmlRequest;
    try {
      const base64Data = await pdf2base64(filePath);
      xmlRequest = `<request>
        <command>pkiNetworkSign</command>
        <ts></ts>
        <txn>${UID()}</txn>
        <certificate>
            <attribute name='CN'></attribute>
            <attribute name='O'></attribute>
            <attribute name='OU'></attribute>
            <attribute name='T'></attribute>
            <attribute name='E'></attribute>
            <attribute name='SN'>${
              certs.sn === "user_prompt" ? '' : certs.sn
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
            <page>${
              page === "first" ? 1 : page === "last" ? "last" : page
            }</page>
            <cood>${coord.x},${coord.y}</cood>
            <size>${size.width},${size.height}</size>
            <enableltv>${enableLTV ? "YES" : "NO"}</enableltv>
            <invisiblesign>${isVisible ? "NO" : "YES"}</invisiblesign>
            <enabletimestamp>${enabletimestamp ? "YES" : "NO"}</enabletimestamp>
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
