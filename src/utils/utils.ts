const fs = require("fs");
const path = require("path");
const saveFileUrlHandler = (url: String) => (localStorage.saveFileUrl || "") + "/" + url;

/**
 * 删除文件夹
 */
function _deleteDir(url: string) {
  url = saveFileUrlHandler(url);
  console.log("url", url);
  var files = [];
  if (fs.existsSync(url)) {
    //判断给定的路径是否存在
    files = fs.readdirSync(url); //返回文件和子目录的数组
    files.forEach(function (file: any, index: any) {
      var curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        //同步读取文件夹文件，如果是文件夹，则函数回调
        _deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath); //是指定文件，则删除
      }
    });
    fs.rmdirSync(url); //清除文件夹
    console.log("清除 旧目标目录", url);
  } else {
    console.log("给定的路径不存在！");
  }
}

export default {
  //
  addJsonAndFolder(dbase: any, name: string) {
    dbase.getData((db: any) => {
      db.get("userList").push({ name, canDelete: true, icon: "icon-shuben" }).write();
      dbase.createFile(`doc/${name}`);
    });
  },
  deleteJsonAndFolder(dbase: any, name: string) {
    dbase.getData((db: any) => {
      db.get("userList").remove({ name }).write();
      _deleteDir(`effieFolder/doc/${name}`);
    });
  },
  addJsonAndFile(dbase: any, activeItem: string, name: string = "") {
    const docName = name || `${new Date().getTime()}.md`;
    dbase.createDoc(`doc/${activeItem}/${docName}`);
    dbase.getData((db: any) => {
      const userList = db.get("userList").find({ name: activeItem });
      const children = userList.value()?.children || [];
      children.push({ name: docName, canDelete: true });
      userList.set("children", children).write();
    });
  },
  deleteJSONAndFile(dbase: any, activeItem: string, name: string) {
    dbase.getData((db: any) => {
      db.get("userList").find({ name: activeItem }).get("children").remove({ name }).write();
      dbase.removeFile(`doc/${activeItem}/${name}`);
    });
  }
};
