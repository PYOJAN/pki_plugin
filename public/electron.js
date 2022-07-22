const { join } = require("path");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const appInit = require("./services/startup-process");
const DB = require("./services/database");
const { version } = require("../package.json");
const getCertFromWindowsStore = require("./services/getCertFromWin");
const { userInfo, platform } = require("os");
const { homedir } = userInfo();
// const Emiter = require("./services/mediatorBridge");

let installExe, reactDevTool;

// Check if the app is running as a production or development environment.
const isDev = !app.isPackaged;

if (isDev) {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer");

  installExe = installExtension;
  reactDevTool = REACT_DEVELOPER_TOOLS;
}

// Main window is created when the app is ready.
let mainWindow;

const createWindow = (cb) => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: app.name,
    show: false,
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    alwaysOnTop: !isDev ? true : false,
    backgroundColor: "transparent",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // Protect against prototype pollution.
      enableRemoteModule: false, // Turn off Remote
      worldSafeExecuteJavaScript: true, // Turn on ExecuteJavaScript
      preload: join(__dirname, "./preload.js"),
    },
  });

  // and load the index.html of the app.
  const appUrl = isDev
    ? "http://localhost:3000"
    : `file://${join(__dirname, "../build/index.html")}`;
  mainWindow.loadURL(appUrl);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  // Sending data to the render process
  mainWindow.on("ready-to-show", () => {
    // Open the DevTools.
    // isDev && mainWindow.webContents.openDevTools({ mode: "detach" });
    isDev && mainWindow.webContents.openDevTools({ mode: "detach" });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
Promise.all([appInit, app.whenReady()])
  // appInit
  .then(async (data) => {
    // Install React Dev Tools.
    isDev && (await installExe(reactDevTool));
    // Create the browser window.
    await createWindow();
    mainWindow.show();
    mainWindow.focus();

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => {
    console.log({
      status: "ERROR",
      message: "Internal Error occurred",
      errorStack: err.stack,
      stack: "Promise.all",
    });
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("EVENT:FROM:RENDER", (_e, arg) => {
  const { eventType } = arg;

  switch (eventType) {
    case "hide":
      isDev ? mainWindow.hide() : mainWindow.quit();
      break;

    default:
      break;
  }
});

/**
 * @Discreaption Sending initial App settings data to render process.
 */
ipcMain.handle("EVENT:INVOCKE:GET:DATA", async (_, ARG) => {
  if (ARG === "CERT") {
    const certs = await getCertFromWindowsStore();
    return certs;
  }

  if (ARG !== "APPVERSION") {
    const allData = await DB.findAll();
    return allData.data;
  } else {
    return version;
  }
});

/**
 * @Updating new setting data from render process
 */
ipcMain.handle("EVENT:INVOCKE:UPDATE:DATA", async (_, ARG) => {
  const { searchKey, data } = ARG;
  let updated;
  let path = join(homedir, "Documents");
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
      const dirInfo = allDirsDetails.data[data];
      const fullPath = dirInfo === undefined ? null : dirInfo.path;

      if (fullPath !== null) {
        const isWin = platform() === "win32" ? "\\" : "/";
        const split = fullPath.split(isWin);
        path = split.slice(0, split.length - 2).join(isWin) + isWin;
      }

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

        updated = await DB.update(searchKey, updatedDir);
      } else {
        updated = { status: false, data: null };
      }
      break;
    case "signature":
      updated = await DB.update(searchKey, data); // Finding data from database and updating
      break;
    default:
      break;
  }
  return updated;
});

// Error Handle
// if the Promise is rejected this will catch it
process.on("unhandledRejection", (error) => {
  dialog.showMessageBox(mainWindow, { message: error });

  console.log({
    status: "ERROR",
    message: "Internal Error occurred",
    errorStack: error.stack,
    stack: "unhandledRejection",
  });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  dialog.showMessageBox(mainWindow, { message: error });
  console.log({
    status: "ERROR",
    message: "Internal Error occurred",
    errorStack: error.stack,
    stack: "uncaughtException",
  });
  process.exit(1);
});
