const { ipcMain, ipcRenderer, contextBridge } = require("electron");

function test() {
  ipcRenderer.on("selectFolder");
}
window.addEventListener("DOMContentLoaded", () => {
  // contextBridge.exposeInMainWorld("electron", {
  //   ipcRenderer
  // });
  // // alert("---");
  // test();
});
