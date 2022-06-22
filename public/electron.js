const { join } = require("path");
const pathResolver = require("./utils/path-resolver");
const { app, BrowserWindow } = require("electron");

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");

// Check if the app is running as a production or development environment.
const isDev = !app.isPackaged;

// Main window is created when the app is ready.
let mainWindow;

const createWindow = () => {
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

  // Open the DevTools.
  isDev && mainWindow.webContents.openDevTools({ mode: "detach" });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    // Install React Dev Tools.
    await installExtension(REACT_DEVELOPER_TOOLS);
    // Create the browser window.
    createWindow();
    mainWindow.show();
    mainWindow.focus();

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (err) {
    console.log(err);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

