const { join, resolve } = require("path");

const pathResolver = (fileName) => {
  return resolve(join(__dirname, "../../../assets/icons", fileName));
};


// module.exports = pathResolver;