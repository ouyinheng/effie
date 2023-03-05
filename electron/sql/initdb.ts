const fs = require("fs");
const low = require("lowdb");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
let db: any = null;
const href = process.env.NODE_ENV === "development" ? "" : `/Users/ouyinheng/Documents/`;
const url = process.env.NODE_ENV === "development" ? "effieFolder/lib/" : `/Users/ouyinheng/Documents/effieFolder/lib/`;
// Set some defaults
export default {
  init(filename: string) {
    if (process.env.NODE_ENV === "production") {
      global.__lib = path.join(__dirname, href + "/effieFolder");
    }
    this.createFile();

    const adapter = new FileSync(url + filename);
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
    if (!fs.existsSync(href + "effieFolder")) fs.mkdirSync(href + "effieFolder");
    if (!fs.existsSync(href + "effieFolder/doc")) fs.mkdirSync(href + "effieFolder/doc");
    if (fs.existsSync(href + `effieFolder/${name}`)) {
    } else {
      fs.mkdirSync(href + `effieFolder/${name}`);
    }
  },
  createDoc(name: string, data = "") {
    fs.writeFile(href + "effieFolder/" + name, data, (err: any) => {
      if (err) {
        return console.error(err);
      }
    });
  },
  removeFolder(name: string) {
    fs.rmdirSync(href + `effieFolder/${name}`);
  },
  readDoc(name: string) {
    const url = href + "effieFolder/" + name;
    return fs.readFileSync(url, "utf-8");
  },
  getData(func: Function) {
    func(db);
  }
};
