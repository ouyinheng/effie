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
      barList: [
        { icon: "icon-sousuo", name: "搜索", canDelete: false },
        { icon: "icon-shuben", name: "全部", canDelete: false },
        { icon: "icon-shanchu", name: "废纸篓", canDelete: false }
      ],
      userList: [
        { icon: "icon-shuben", name: "文稿箱", canDelete: false },
        { icon: "icon-shuben", name: "新建文件夹", canDelete: true }
      ]
    }).write();
  },
  createFile(name = "lib") {
    if (!fs.existsSync(saveFileUrlHandler("effieFolder"))) fs.mkdirSync(saveFileUrlHandler("effieFolder"));
    if (!fs.existsSync(saveFileUrlHandler("effieFolder/doc"))) fs.mkdirSync(saveFileUrlHandler("effieFolder/doc"));
    if (fs.existsSync(saveFileUrlHandler(`effieFolder/${name}`))) {
    } else {
      fs.mkdirSync(saveFileUrlHandler(`effieFolder/${name}`));
    }
  },
  createDoc(name: string, data = "") {
    fs.writeFile(saveFileUrlHandler("effieFolder/" + name), data, (err: any) => {
      if (err) {
        return console.error(err);
      }
    });
  },
  removeFolder(name: string) {
    fs.rmdirSync(saveFileUrlHandler(`effieFolder/${name}`));
  },
  removeFile(name: string) {
    fs.unlinkSync(saveFileUrlHandler(`effieFolder/${name}`));
  },
  readDoc(name: string) {
    try {
      const url = saveFileUrlHandler("effieFolder/" + name);
      return fs.readFileSync(url, "utf-8");
    } catch (error) {
      this.createDoc(name, "");
    }
  },
  getData(func: Function) {
    func(db);
  }
};
