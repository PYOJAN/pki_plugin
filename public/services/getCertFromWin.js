const winCA = require("win-ca");
const crypto = require("crypto");
const { platform } = require("os");

/**
 *
 * @returns it's returning user certificate from window certificate store.
 */
const getCertFromWindowsStore = async () => {
  let list = [];
  let AllCerts = [];
  let validCert = [];

  if (platform() === "win32") {
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
  } else {
    validCert = [
      {
        status: "fail",
        platform: platform(),
        message: "This feature only for windows Application.",
      },
    ];
  }

  return validCert.length <= 0
    ? null
    : validCert;
};

module.exports = getCertFromWindowsStore;
