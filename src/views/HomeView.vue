<template>
  <div class="home-view">
    <div class="drag-bar">
      <span class="shouqi iconfont icon-jiantou_xiangzuoliangci" @click="toggleLeft"></span>
      <span class="shouqi iconfont icon-shezhi" style="left: 95px" @click="goSetup"></span>
    </div>
    <transition-group name="list" mode="fade-in">
      <div key="leftNav" class="left-nav" v-if="state.showLeft">
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

    <RightMenu :value="state.rightShow" :options="state.optionsData" :menuItem="state.menuItem" @setShow="setShow">
    </RightMenu>
    <n-modal
      v-model:show="state.dialogVisible"
      :mask-closable="false"
      :closable="false"
      :show-icon="false"
      preset="dialog"
      title="请输入文件名"
      content="你确认"
      positive-text="确认"
      negative-text="算了"
      :positive-button-props="{ disabled: confirmDisabled }"
      @positive-click="handleConfirm"
      @negative-click="handleClose"
    >
      <div>
        <n-input v-model:value.trim="state.folderValue" type="text" placeholder="请输入文件名" />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onDeactivated, onMounted, reactive, ref, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useCounterStore } from "@/stores/counter";
import BarItem from "@/components/barItem.vue";
import Docitem from "@/components/docItem.vue";
import RightMenu from "@/components/rightMenu.vue";
import initdb from "@elec/sql/initdb";
import { fi } from "date-fns/locale";
const $utils: any = inject("$utils");

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
  showLeft: true
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
const confirmDisabled = computed(() => {
  return !state.folderValue.trim()?.length;
});
const showDocItem = computed(() => {
  return (
    !store.state.fileList.length &&
    store.state.activeItem &&
    !["全部", "搜索", "废纸篓"].includes(store.state.activeItem)
  );
});

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
    state.menuItem.push({
      label: "删除文稿",
      fun: () => delDoc(item)
    });
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
const goSetup: any = () => {
  router.push({
    path: "/setup"
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
const handleConfirm = () => {
  if (!state.folderValue) return;
  $utils.addJsonAndFolder(initdb, state.folderValue);
  getFolderList();
  handleClose();
};
const handleClose = () => {
  state.folderValue = "";
  state.dialogVisible = false;
};
const onResizeHandler = () => {
  const optionBar = document.querySelector(".option-bar")?.clientHeight || 0;
  const addBarGroup = document.querySelector(".add-bar-group")?.clientHeight || 0;
  const defaultBar = document.querySelector(".default-bar")?.clientHeight || 0;
  state.newDocHeight = optionBar - addBarGroup - defaultBar - 80;
};
// 获取左侧菜单
onMounted(() => {
  initdb.init("setup.json");
  initdb.getData((db: any) => {
    state.barList = db.get("barList").value();
    state.userList = db.get("userList").value();
    state.userList.forEach((folder: any) => {
      initdb.createFile("doc/" + folder.name);
    });
  });
  state.defaultMenuItem.push({ label: "新建文件夹", fun: createDoc });
  getAllFile();
  onResizeHandler();
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
  }
  .maxWidth {
    width: 100% !important;
  }
}
</style>
