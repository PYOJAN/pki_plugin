const { Tray, Menu, nativeImage } = require("electron");
const { join } = require("path");

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Edit",
    submenu: [
      {
        id: "revert-changes",
        label: "Revert Changes",
        // click: revertChanges,
        enabled: false,
      },
    ],
  },
]);

const sysTray = () => {
  let tray = null;
  const icon = nativeImage.createFromPath(
    join(__dirname, "../assets/App-Icon.png")
  );

  tray = new Tray(icon);

  tray.setContextMenu(contextMenu);
};

module.exports = {
  sysTray,
  contextMenu,
};
