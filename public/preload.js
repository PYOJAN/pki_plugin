const { contextBridge, ipcRenderer } = require("electron");

const API = {
  IPC: {
    once(channel, ...arg) {
      ipcRenderer.once(channel, ...arg);
    },
    on(channel, ...arg) {
      ipcRenderer.on(channel, ...arg);
    },
    ipcSendEvent(channel, ...arg) {
      ipcRenderer.send(channel, ...arg);
    },
    ipcInvoke(channel, ...arg) {
      return ipcRenderer.invoke(channel, ...arg);
    },
  },
};

contextBridge.exposeInMainWorld("electron", API);