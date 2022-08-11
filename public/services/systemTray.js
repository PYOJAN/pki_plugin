const { Tray, Menu, nativeImage, app } = require("electron");
const { join } = require("path");
const { Transport, emmiterNames } = require("./emmiter");

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Show PKI Plugin",
    click: () => {
      Transport.trigger("showMainWindow");
    },
  },
  {
    label: "Quit",
    click: () => {
      app.quit();
    },
  },
]);

const sysTray = () => {
  let tray = null;
  const icon = nativeImage.createFromPath(
    join(__dirname, "../assets/App-Icon.png")
  );

  tray = new Tray(icon);
  tray.setToolTip("PKI Plugin");
  tray.setContextMenu(contextMenu);
};

module.exports = {
  sysTray,
  contextMenu,
};
