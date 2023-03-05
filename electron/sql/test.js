const fs = require("fs");
const low = require("lowdb");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
let db = null;
// Set some defaults
export default {
  init(filename) {
    console.log("filename", filename);
    if (process.env.NODE_ENV === "production") {
      global.__lib = path.join(__dirname, "./static");
    }
    this.createFile();
    const url = process.env.NODE_ENV === "development" ? "static/lib/" + filename : `${global.__lib}/lib/` + filename;
    const adapter = new FileSync(url);
    db = low(adapter);
    db.defaults({ posts: [] }).write();
  },
  createFile(name = "lib", data) {
    if (!fs.existsSync("static")) fs.mkdirSync("static");
    if (fs.existsSync(`static/${name}`)) {
    } else {
      fs.mkdirSync(`static/${name}`);
    }
  },
  getData(func) {
    func(db);
  }
};
