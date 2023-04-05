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
  },
  resizeImg(dom: HTMLElement, actionScope: any) {
    let resizeFlag: boolean = false;
    let resizeFdom: Element;
    let pageX = 0;
    let pageY = 0;
    let width = 200;
    let parent: any = null;
    addResize();
    setTimeout(() => {
      init();
    });
    function init() {
      mouseDown();
      mouseMove();
      mouseUp();
      mouseLeave();
    }
    function addResize() {
      parent = dom.parentElement;
      parent.setAttribute("class", "img-parent");
      resizeFdom = document.createElement("div");
      resizeFdom.setAttribute("class", "img-resize");
      parent?.appendChild(resizeFdom);
    }
    function mouseDown() {
      resizeFdom.addEventListener("mousedown", () => {
        resizeFlag = true;
      });
    }
    function mouseMove() {
      actionScope.addEventListener("mousemove", (e: MouseEvent) => {
        if (resizeFlag) {
          if (!pageX) pageX = e.pageX;
          if (!pageY) pageY = e.pageY;
          width = Number(dom?.style.width.replace("px", "")) || 200;
          let x = e.pageX - pageX;
          width += x;
          dom.style.width = width + "px";
          pageX = e.pageX;
        }
      });
    }
    function mouseUp() {
      actionScope.addEventListener("mouseleave", (e: MouseEvent) => {
        resizeFlag = false;
      });
    }
    function mouseLeave() {
      actionScope.addEventListener("mouseup", (e: MouseEvent) => {
        resizeFlag = false;
        parent.setAttribute("class", "");
        parent?.removeChild(resizeFdom);
      });
    }
  }
};
