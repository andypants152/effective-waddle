const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("petAPI", {
  moveWindow(dx, dy) {
    ipcRenderer.send("pet:move-window", dx, dy);
  },
  quit() {
    ipcRenderer.send("pet:quit");
  }
});