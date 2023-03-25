<template>
  <div class="home-view">
    <div class="drag-bar">
      <span class="shouqi iconfont icon-jiantou_xiangzuoliangci" @click="toggleLeft"></span>
    </div>
    <transition-group name="list" mode="fade-in">
      <div key="leftNav" class="left-nav" v-if="state.showLeft">
        <ToolBar></ToolBar>
        <div class="option-bar" @contextmenu="onContextMenu($event)">
          <div class="add-bar-group border-bottom">
            <BarItem icon="icon-plus" name="新建文稿" @click="addFile" />
          </div>
          <div class="border-bottom default-bar pb-5">
            <BarItem
              v-for="item in state.barList"
              :key="item.name"
              :active="item.name === store.state.activeItem"
              :icon="item.icon"
              :name="item.name"
              @click="sysBarClick(item)"
            />
          </div>
          <div
            class="new-doc mt-10"
            :style="{
              height: state.newDocHeight + 'px'
            }"
          >
            <BarItem
              v-for="item in state.userList"
              :key="item.name"
              :active="item.name === store.state.activeItem"
              :icon="item.icon"
              :name="item.name"
              @click="setActiveItem(item.name)"
              @contextmenu.stop="onContextBarMenu($event, item)"
            />
          </div>
          <div class="more-options border-top">
            <a-dropdown @select="handleSelect" :popup-max-height="false">
              <BarItem :loading="state.loading" name="更多操作" />
              <template #content>
                <a-doption @click="showSetupDialog">
                  <icon-settings class="shouqi" style="left: 95px" />
                  <span class="dop-text">设置</span>
                </a-doption>
                <a-doption @click="goOthrePage('picture')">
                  <icon-image class="shouqi iconfont icon-yunpan" style="left: 120px" />
                  <span class="dop-text">图片</span>
                </a-doption>
                <a-doption @click="refresh">
                  <icon-refresh />
                  <span class="dop-text">同步</span>
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="add-list" @contextmenu.stop="onContextDocMenu($event)">
          <Docitem @click="addDoc" v-if="showDocItem" />
          <transition-group name="list" mode="fade-in">
            <Docitem
              v-for="item in store.state.fileList"
              :key="item.name"
              :emptyBtn="false"
              :docData="item"
              :selectdoc="store.state.selectdoc"
              :activeItem="store.state.activeItem"
              @contextmenu.stop="onContextDocMenu($event, item)"
              @click="setSelectDoc(item)"
            />
          </transition-group>
        </div>
      </div>
      <section key="rightContent" class="right-content" :class="[state.showLeft ? '' : 'maxWidth']">
        <RouterView />
      </section>
    </transition-group>

    <RightMenu
      :value="state.rightShow"
      :options="state.optionsData"
      :menuItem="state.menuItem"
      @setShow="setShow"
    >
    </RightMenu>
    <AddFolder :value="state.dialogVisible" @confirm="addFolderConfirm"></AddFolder>
    <Setup :value="state.showSetUpDialog" @setValue="setSetupValue"></Setup>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onDeactivated, onMounted, reactive, ref, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useCounterStore } from "@/stores/counter";
import BarItem from "@/components/barItem.vue";
import Docitem from "@/components/docItem.vue";
import RightMenu from "@/components/rightMenu.vue";
import ToolBar from "@/components/toolbar.vue";
import Setup from "@/views/setup/index.vue";
import AddFolder from "@/views/homePages/AddFolder.vue";
import initdb from "@elec/sql/initdb";
import setupdb from "@elec/sql/setup";
import { menuEvent } from "./menu.mixins";
import { Message } from "@arco-design/web-vue";

const { ipcRenderer: ipc } = require("electron");
const $utils: any = inject("$utils");
const { exportImg } = menuEvent();
const state: any = reactive({
  barList: [],
  userList: [], // 用户添加的文件夹
  optionsData: {},
  rightShow: false,
  dialogVisible: false,
  folderValue: "",
  newDocHeight: 200,
  defaultMenuItem: [],
  menuItem: [],
  showLeft: true,
  showSetUpDialog: false,
  loading: false
});
let router = useRouter();
let route = useRoute();
const store: any = useCounterStore();
watch(
  () => store.state.selectdoc,
  (newVal, oldVal) => {
    if (store.state.selectdoc?.name) {
      router.push({
        path: "/home/mainPage"
      });
    } else {
      router.push({
        path: "/home/empty"
      });
    }
  },
  {
    immediate: true
  }
);
// computed

const showDocItem = computed(() => {
  return (
    !store.state.fileList.length &&
    store.state.activeItem &&
    !["全部", "搜索", "废纸篓"].includes(store.state.activeItem)
  );
});

// 添加文件夹
const addFolderConfirm = (folderValue: string) => {
  state.dialogVisible = false;
  if (!folderValue) {
    return;
  }
  $utils.addJsonAndFolder(initdb, folderValue);
  getFolderList();
};

// 事件
const sysBarClick = (item: any) => {
  setActiveItem(item.name);
  switch (item.name) {
    case "全部":
      getAllFile();
      break;
    default:
      break;
  }
};

// 展示设置弹窗
const showSetupDialog = () => {
  state.showSetUpDialog = true;
};
const setSetupValue = (val: Boolean) => {
  state.showSetUpDialog = val;
};
// 同步
const refresh = async () => {
  try {
    state.loading = true;
    let res = await ipc.invoke("saveToGit", "git pull origin main");
    console.log("res1", res);
    if (res?.error) return;
    res = await ipc.invoke("saveToGit", "git add *");
    console.log("res2", res);
    if (res?.error) return;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDay();
    res = await ipc.invoke("saveToGit", `git commit -m '${year + "" + month + "" + day}更新'`);
    console.log("res3", res);
    if (res?.error) {
      throw new Error();
    }
    res = await ipc.invoke("saveToGit", "git push origin main");
    console.log("res4", res);
    if (res?.error) {
      throw new Error();
    }
    state.loading = false;
    Message.success("同步成功");
  } catch (error) {
    state.loading = false;
    Message.error("同步失败：可能为内容没有更改");
  }
};
// 获取全部文件
const getAllFile = () => {
  initdb.getData((db: any) => {
    const fileList: any[] = [];
    const userList = db.get("userList").value();
    userList.forEach((ele: any) => {
      const list = ele?.children || [];
      list.forEach((file: any) => (file.parent = ele.name));
      fileList.push(...list);
    });
    store.setFileListData(fileList);
    store.setSelectDoc(fileList[0]);
  });
};
const handleSelect = () => {};
// 事件
const addFile = () => {
  let activeItem = store.state.activeItem;
  if (["搜索", "全部", "废纸篓"].includes(activeItem)) {
    activeItem = "文稿箱";
    store.setActiveItem(activeItem);
  }
  $utils.addJsonAndFile(initdb, activeItem);
  getFileList();
};

const createDoc = (name: string) => {
  console.log("new");
  state.dialogVisible = true;
};
const deleteDoc = (item: any) => {
  $utils.deleteJsonAndFolder(initdb, item.name);
  if (store.state.activeItem === item.name) {
    store.setActiveItem("");
    store.setFileListData(ref([]));
  }
  getFolderList();
};
const setSelectDoc = (item: any) => {
  store.setSelectDoc(item);
};
const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  state.optionsData.x = e.x;
  state.optionsData.y = e.y;
  state.menuItem = [...state.defaultMenuItem];
  state.rightShow = true;
};
const onContextBarMenu = (e: MouseEvent, item: any) => {
  e.preventDefault();
  state.optionsData.x = e.x;
  state.optionsData.y = e.y;
  // state.selectMenuData = item;
  state.menuItem = [...state.defaultMenuItem, { label: "删除", fun: () => deleteDoc(item) }];
  state.rightShow = true;
};
const onContextDocMenu = (e: MouseEvent, item = null) => {
  e.preventDefault();
  state.optionsData.x = e.x;
  state.optionsData.y = e.y;
  state.menuItem = [{ label: "新建文稿", fun: addDoc }];
  if (item && store.state.activeItem !== "全部") {
    state.menuItem.push(
      {
        label: "删除文稿",
        fun: () => delDoc(item)
      },
      {
        label: "导出",
        children: [{ label: "导出成图片", fun: () => exportImg(item) }]
      }
    );
  }
  state.rightShow = true;
};
const setShow = (val: boolean) => {
  state.rightShow = val;
};
const initState: Function = () => {
  store.setSelectDoc(null);
};
const setActiveItem: Function = (name: string) => {
  initState();
  // 选择的文件夹
  store.setActiveItem(name);
  getFileList();
};
const toggleLeft: any = () => {
  state.showLeft = !state.showLeft;
  router.push({
    path: route.path,
    query: {
      ...route.query,
      preview: state.showLeft
    }
  });
};
const goOthrePage: any = (path: string) => {
  router.push({
    path: "/" + path
  });
};
// 添加文件
const addDoc: any = () => {
  $utils.addJsonAndFile(initdb, store.state.activeItem);
  getFileList();
};
// 删除文件
const delDoc: any = (item: any) => {
  const { name, canDelete } = item;
  if (!canDelete) return;
  $utils.deleteJSONAndFile(initdb, store.state.activeItem, name);
  if (name === store.state.selectdoc?.name) {
    store.setSelectDoc(null);
  }
  getFileList();
};
const getFileList: Function = () => {
  initdb.getData((db: any) => {
    const userList = db.get("userList").find({ name: store.state.activeItem });
    const children = userList.value()?.children || [];
    store.setFileListData(ref(children));
  });
  if (!store.state.selectdoc?.name) {
    const selectdoc = store.state.fileList?.length ? store.state.fileList[0] : null;
    store.setSelectDoc(selectdoc);
  }
};
const getFolderList: Function = () => {
  initdb.getData((db: any) => {
    state.userList = [];
    state.userList = ref(db.get("userList").value());
  });
};

const onResizeHandler = () => {
  console.log("--resize");
  const optionBar = document.querySelector(".option-bar")?.clientHeight || 0;
  const addBarGroup = document.querySelector(".add-bar-group")?.clientHeight || 0;
  const defaultBar = document.querySelector(".default-bar")?.clientHeight || 0;
  state.newDocHeight = optionBar - addBarGroup - defaultBar - 80 - 40;
};
// 获取左侧菜单
onMounted(() => {
  initdb.init("setup.json");
  setupdb.init("option.json");
  initdb.getData((db: any) => {
    state.barList = db.get("barList").value();
    state.userList = db.get("userList").value();
    state.userList.forEach((folder: any) => {
      initdb.createFile("doc/" + folder.name);
    });
  });
  state.defaultMenuItem.push({ label: "新建文件夹", fun: createDoc });
  getAllFile();
  setTimeout(() => {
    onResizeHandler();
  }, 400);
  window.addEventListener("resize", onResizeHandler);
});
onDeactivated(() => {
  window.removeEventListener("resize", onResizeHandler);
});
</script>

<style lang="less" scoped>
.icon-plus {
  font-weight: bold;
  font-size: 16px;
}
.home-view {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  .drag-bar {
    width: 180px;
    height: 35px;
    -webkit-app-region: drag;
    position: absolute;
    left: 0;
    top: 0;
    right: 140px;
    z-index: 999;
    display: flex;
    align-items: center;
    .shouqi {
      -webkit-app-region: no-drag;
      position: absolute;
      left: 70px;
      top: 2px;
      padding: 0 5px;
      z-index: 999;
      &:hover {
        background-color: #d3d3d3;
        border-radius: 5px;
      }
    }

    svg {
      height: 25px !important;
      font-size: 16px;
      padding: 4px 0;
    }
    .icon-shezhi {
      font-weight: bold;
    }
  }
  .left-nav {
    display: flex;
    width: 440px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .option-bar {
      width: 180px;
      height: 100%;
      box-sizing: border-box;
      padding: 0 10px 10px;
      padding-top: 40px;
      .add-bar-group {
        padding-bottom: 5px;
        margin: 0 0px 10px;
      }
      .new-doc {
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .scrollMixins();
      }
      .active-item {
        background-color: #c2c4c6;
        border-radius: 5px;
      }
    }
    .add-list {
      width: 260px;
      height: 100%;
      padding: 10px;
      overflow: auto;
      box-sizing: border-box;
      overflow-x: hidden;
      .scrollMixins();
      & > div {
        margin-bottom: 10px;
      }
    }
  }
  .right-content {
    width: calc(100% - 250px);
    height: 100%;
    background-color: #fff;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }
  .maxWidth {
    width: 100% !important;
  }
}
.more-options {
  width: 100%;
  padding: 10px 0 0;
  margin-top: 10px;
  box-sizing: border-box;
  user-select: none;
  .bar-item {
    display: flex;
    justify-content: space-around;
  }
}
</style>

<style lang="less">
.arco-trigger-popup {
  .arco-dropdown {
    padding: 5px;
    background-color: #e3e5e5;
    border-radius: 5px;
    .arco-dropdown-option {
      line-height: 20px;
      padding: 4px 20px;
      border-radius: 5px;
      &:hover {
        background-color: #4676ee;
        color: white;
      }
    }
  }
  .dop-text {
    margin-left: 10px;
  }
}
</style>
