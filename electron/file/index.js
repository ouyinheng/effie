const fs = require("fs");
const path = require("path");

export default {
  init() {
    return ["saveFile", "getFileData", "WhetherTheFileExists"];
  },
  saveFile(event, name = "test", data) {
    console.log("name:saveFile", name);
    if (fs.existsSync("E:\\diary\\")) {
      fs.writeFile("E:\\diary\\" + name, data, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    } else {
      fs.mkdirSync("E:\\diary");
      fs.writeFile("E:\\diary\\" + name, data, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    }
  },
  getFileData(event, url) {
    fs.readFile(path.join(__dirname, url), "utf8", (err, data) => {
      console.log(data);
      if (err) {
        event.sender.send("asynchronous-reply", "读取失败");
      } else {
        event.sender.send("asynchronous-reply", data);
      }
    });
  },
  /**
   * 文件是否存在，如果不存在则创建
   * @param fileName {String} 文件名
   * @param isFolder {Boolean} 是不是文件夹
   */
  WhetherTheFileExists(fileName, isFolder = false) {
    return new Promise((resolve, rejects) => {
      if (isFolder) {
        if (fs.existsSync(`E:\\${fileName}\\`)) {
          // 存在
          console.log("存在");
          resolve();
        } else {
          fs.mkdirSync("E:\\diary");
          resolve();
        }
      } else {
        fs.access(`E:\\${fileName}\\`, fs.constants.F_OK, (err) => {
          console.log(`E:\\${fileName}\\ ${err ? "不存在" : "存在"}`);
          if (err) {
            // 不存在，创建
            resolve();
          } else {
            resolve();
          }
        });
      }
    });
  }
};
