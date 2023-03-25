const fs = require("fs");
const low = require("lowdb");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
let db: any = null;
const saveFileUrlHandler = (url: String) => (localStorage.saveFileUrl || "") + "/" + url;
const urlHanlder = () => (localStorage.saveFileUrl || "") + "/effieFolder/lib/";

export default {
  init(filename: string) {
    if (process.env.NODE_ENV === "production") {
      global.__lib = path.join(__dirname, saveFileUrlHandler("effieFolder"));
    }
    this.createFile();

    const adapter = new FileSync(urlHanlder() + filename);
    db = low(adapter);
    db.defaults({
      github: {
        giturl: "",
        ssh: "",
        init: false
      },
      huaban: {}
    }).write();
  },
  createFile(name = "lib") {
    if (!fs.existsSync(saveFileUrlHandler("effieFolder")))
      fs.mkdirSync(saveFileUrlHandler("effieFolder"));
    if (!fs.existsSync(saveFileUrlHandler("effieFolder/doc")))
      fs.mkdirSync(saveFileUrlHandler("effieFolder/doc"));
    if (fs.existsSync(saveFileUrlHandler(`effieFolder/${name}`))) {
    } else {
      fs.mkdirSync(saveFileUrlHandler(`effieFolder/${name}`));
    }
  },
  getData(func: Function) {
    func(db);
  }
};
