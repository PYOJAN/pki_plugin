const { join } = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const appInit = require("./services/startup-process");
const DB = require("./services/database");
// const Emiter = require("./services/mediatorBridge");

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");

// Check if the app is running as a production or development environment.
const isDev = !app.isPackaged;

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
    // alwaysOnTop: true,
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
    await installExtension(REACT_DEVELOPER_TOOLS);
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
ipcMain.on("EVENT:FROM:RENDER", (e, arg) => {
  const { eventType } = arg;

  switch (eventType) {
    case "hide":
      mainWindow.hide();
      break;

    default:
      break;
  }
});

/**
 * @Discreaption Sending initial App settings data to render process.
 */
ipcMain.handle("EVENT:INVOCKE:GET:DATA", async (_, ARG) => {
  const dirs = await DB.findOne(ARG);

  return dirs;
});

/**
 * @Updating new setting data from render process
 */
ipcMain.handle("EVENT:INVOCKE:FOR:UPDATE:SETTING", async (_, ARG) => {
  const { searchKey, data } = ARG;
  // Finding data from database
  const updated = await DB.update(searchKey, data);
  return updated;
});

// Error Handle
// if the Promise is rejected this will catch it
process.on("unhandledRejection", (error) => {
  console.log({
    status: "ERROR",
    message: "Internal Error occurred",
    errorStack: error.stack,
    stack: "unhandledRejection",
  });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log({
    status: "ERROR",
    message: "Internal Error occurred",
    errorStack: error.stack,
    stack: "uncaughtException",
  });
  process.exit(1);
});
