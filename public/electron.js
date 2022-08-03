const { join } = require("path");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const appInit = require("./services/startup-process");
const {
  updateData,
  getConfigData,
  handleWindow,
} = require("./services/ipc-communication");
const {
  StartSigningService,
  StopSigningService,
} = require("./services/signing-service");
const { sysTray } = require("./services/systemTray");
const { checkConfig } = require("./utils/utils");

let installExe, reactDevTool;

// Check if the app is running as a production or development environment.
const isDev = !app.isPackaged;
if (isDev) {
  // Import REACT_DEVTOOL if is in the Development stage
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer");
  installExe = installExtension;
  reactDevTool = REACT_DEVELOPER_TOOLS;
}

// Main window is created when the app is ready.
let mainWindow;
exports.mainWindow = mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: app.name,
    show: false,
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    alwaysOnTop: !isDev ? true : false,
    icon: join(__dirname, "./assets/App-Icon.png"),
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
    isDev && mainWindow.webContents.openDevTools({ mode: "detach" });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
Promise.all([appInit, app.whenReady()])
  // appInit
  .then(async () => {
    // Install React Dev Tools.
    isDev && (await installExe(reactDevTool));
    // Create the browser window.
    createWindow();
    mainWindow.show();
    mainWindow.focus();

    // sysTray();

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => {
    console.log({
      status: "ERROR",
      message: err.message,
      errorStack: err.stack,
      stack: "Promise.all",
    });
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/**
 * @description Window managment center
 */
ipcMain.on("EVENT:FROM:RENDER", (_e, arg) => {
  const { eventType } = arg;
  handleWindow(eventType, mainWindow);
});

/**
 * @Discreaption Sending initial App settings data to render process.
 */
ipcMain.handle("EVENT:INVOCKE:GET:DATA", async (_, ARG) => {
  return await getConfigData(ARG);
});
/**
 * @Updating new setting data from render process
 */
ipcMain.handle("EVENT:INVOCKE:UPDATE:DATA", async (_, ARG) => {
  return await updateData(ARG, mainWindow);
});

// Signing service controll
const service = {
  START: "START",
  STOP: "STOP",
};
ipcMain.handle("EVENT:INVOCKE:SIGNIG:SERVICE", async (_, ARG) => {
  const { isValid, message } = await await checkConfig();

  switch (ARG.isStart) {
    case service.START:
      if (isValid) {
        StartSigningService();
      }
      break;
    case service.STOP:
      StopSigningService();
      break;
    default:
      break;
  }

  return { isValid, message };
});

// Error Handle
// if the Promise is rejected this will catch it
process.on("unhandledRejection", (error) => {
  dialog.showErrorBox("ERROR", error.message);

  isDev &&
    console.log({
      status: "ERROR",
      message: error.message,
      errorStack: error.stack,
      stack: "unhandledRejection",
    });
  // process.exit(1);
});

process.on("uncaughtException", (error) => {
  dialog.showErrorBox("ERROR", error.message);
  isDev &&
    console.log({
      status: "ERROR",
      message: error.message,
      errorStack: error.stack,
      stack: "uncaughtException",
    });
  // process.exit(1);
});
