const winCA = require("win-ca");
const crypto = require("crypto");

const getCertFromWindowsStore = async () => {
  let list = [];
  let AllCerts = [];
  let validCert = [];
  await winCA({ store: ["my"], ondata: list });

  list.length > 0 &&
    list.forEach((cer) => {
      const cert = new crypto.X509Certificate(cer);
      const subject = cert.subject;
      const sn = cert.serialNumber;
      const validTo = cert.validTo;
      const keyUsage = cert.keyUsage;

      const name = subject.split("\n").pop().split("=").pop();

      AllCerts.push({ name, sn, validTo, keyUsage });

      validCert = AllCerts.filter(
        (cer) =>
          cer.keyUsage &&
          !cer.keyUsage.includes("1.3.6.1.4.1.311.10.3.4") &&
          new Date(cer.validTo) >= new Date()
      );
    });

  return validCert;
};

module.exports = getCertFromWindowsStore;
