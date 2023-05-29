const path = require("path");

const config = {};

/**
 * 开发者工具
 */
config.openDevTools = true;

/**
 * 主窗口
 */
config.windowsOption = {
  title: "Effie",
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 550,
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
};

exports.default = config;
