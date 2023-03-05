const fs = require("fs");
const low = require("lowdb");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
let db: any = null;
const href = `~/Documents/`;
// Set some defaults
export default {
  init(filename: string) {
    if (process.env.NODE_ENV === "production") {
      global.__lib = path.join(__dirname, "~/Documents/effieFolder");
    }
    this.createFile();
    const url = process.env.NODE_ENV === "development" ? "static/lib/" + filename : `${global.__lib}/lib/` + filename;
    const adapter = new FileSync(url);
    db = low(adapter);
    db.defaults({
      folders: [{ name: "文稿箱", icon: "", canDelete: false }]
    }).write();
  },
  createFile() {
    if (!fs.existsSync("static")) fs.mkdirSync("static");
    if (fs.existsSync("static/lib")) {
    } else {
      fs.mkdirSync("static/lib");
    }
  },
  getData(func: Function) {
    func(db);
  }
};
