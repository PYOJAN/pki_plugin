const {
  ensureDir,
  writeJson,
  readJson,
  pathExists,
} = require("fs-extra");
const { join } = require("path");
const { homedir } = require("os");

const DEFAULT_SETTINGS = join(
  __dirname,
  "../../database",
  "default_setting.json"
);
const APPSETTING = join(__dirname, "../../database", "setting.json");
const ALLDIRS = [
  join(homedir(), "Documents", "bulkSign", "source"),
  join(homedir(), "Documents", "bulkSign", "original"),
  join(homedir(), "Documents", "bulkSign", "signed"),
];

const appInit = new Promise(async (resolve, reject) => {
  try {
    // reading default settings
    const defaultSettingData = await readJson(DEFAULT_SETTINGS, {
      throws: true,
    });

    /**
     * @AppSetting creation
     */
    const isAppDBCreated = await pathExists(APPSETTING);
    const updatingIsFirstTimeValue = {
      ...defaultSettingData,
      isFirstTime: {
        dbCreated: true,
        dirCreated: false,
      },
    };
    !isAppDBCreated && writeJson(APPSETTING, updatingIsFirstTimeValue);

    /**
     * @DefaultDir Creation
     */
    let updatedSetting = {
      ...defaultSettingData,
    };
    ALLDIRS.forEach(async (path, index) => {
      const pathName = path.split("/").pop().split("\\").pop();

      const isDirExist = await pathExists(path);
      if (!isDirExist) {
        await ensureDir(path);

        updatedSetting = {
          ...updatedSetting,
          [pathName]: {
            isDefault: true,
            name: pathName,
            path: path,
          },
        };

        index === 2 && (await writeJson(APPSETTING, updatedSetting));
      }
    });

    return resolve({
      status: "success",
      message: "Initial configration complete",
      stack: "appInit",
    });
  } catch (err) {
    return reject({
      status: "ERROR",
      message: "Internal Error occurred",
      errorStack: err.stack,
      stack: "appInit",
    });
  }
});

module.exports = appInit;
