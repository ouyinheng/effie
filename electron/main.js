const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    title: "Effie",
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 550,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      devTools: true,
      //webSecurity: false, // 跨域问题 -> 打开注释
      contextIsolation: false, // false -> 可在渲染进程中使用electron的api，true->需要bridge.js(contextBridge)
      nodeIntegration: true
      //preload: path.join(appInfo.baseDir, 'preload', 'bridge.js'),
    },
    frame: true,
    show: true,
    icon: path.join(__dirname, "public", "images", "logo-32.png")
  });
  if (app.isPackaged) {
    // win.webContents.openDevTools();
    console.log("现在是打包后的");
    win.loadFile(path.join(__dirname, "./dist/index.html"));
  } else {
    console.log("现在是线上的");
    win.webContents.openDevTools();
    let url = "http://localhost:5173"; // 本地启动的vue项目路径
    win.loadURL(url);
  }
};

app.whenReady().then(() => {
  createWindow();
});
