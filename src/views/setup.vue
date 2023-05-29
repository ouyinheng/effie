<template>
  <div class="setup">
    <div class="drag-bar">
      <span class="shouqi iconfont icon-jiantou_xiangzuoliangci" @click="back"></span>
    </div>
    <div class="main-box">
      <nav>
        <n-list hoverable clickable>
          <n-list-item v-for="item in state.itemList" :key="item.name" @click="setOption(item)">
            {{ item.name }}
          </n-list-item>
        </n-list>
      </nav>
      <section>
        <n-input
          v-if="state.activeItem === 'git仓库'"
          v-model:value="state.gitRemote"
          type="text"
          placeholder="请输入"
        />
        <n-button @click="saveToGit">saveToGit</n-button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
const { ipcRenderer: ipc } = require("electron");

let router = useRouter();
const state = reactive({
  gitRemote: "",
  activeItem: "",
  itemList: [{ name: "git仓库" }, { name: "图库" }]
});

//
const setOption = (item: any) => {
  state.activeItem = item.name;
};
const saveToGit = () => {
  console.log("save");
  // ipc.invoke("saveToGit", "git init");
  // ipc.invoke("saveToGit", "git remote add origin https://gitee.com/ouyinheng/document.git");
  // ipc.invoke("saveToGit", "git add *");
  // ipc.invoke("saveToGit", "git commit -m 'test'");
  ipc.invoke("saveToGit", "git push origin main");
};
const back = () => {
  router.back();
};
state.activeItem = state.itemList[0].name;
</script>

<style lang="less" scoped>
.setup {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 40px 40px;
  position: relative;
  background-color: #e0e0e0;

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
  }
  .main-box {
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 10px #ffffff;
    border-radius: 10px;
    overflow: hidden;
    background-color: white;
    display: flex;
    nav {
      width: 300px;
      padding: 30px 10px;
      box-sizing: border-box;
    }
    section {
      width: calc(100% - 200px);
      height: 100%;
      overflow: auto;
      padding: 30px 10px;
      box-sizing: border-box;
    }
  }
}
</style>
