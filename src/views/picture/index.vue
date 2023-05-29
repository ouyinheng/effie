<template>
  <div class="setup">
    <div class="drag-bar">
      <span class="shouqi iconfont icon-jiantou_xiangzuoliangci" @click="back"></span>
    </div>
    <div class="main-box">
      <a-image
        v-for="(item, index) in state.beautyList"
        :key="index"
        :src="imgUrl(item)"
        :title="item.raw_text"
        :description="item.board.description"
        class="image"
      >
        <template #extra>
          <div class="actions">
            <span class="action" @click="onDownLoad"><icon-download /></span>
          </div>
        </template>
      </a-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { useRouter } from "vue-router";
const { ipcRenderer: ipc } = require("electron");

const { proxy } = getCurrentInstance();
let router = useRouter();
const state = reactive({
  gitRemote: "",
  activeItem: "",
  beautyList: [],
  srcList: [],
  itemList: [{ name: "git仓库" }, { name: "图库" }]
});
const visible1 = ref(false);

const back = () => {
  router.back();
};

const imgUrl = (item: any) => {
  console.log(item);
  return `https://gd-hbimg.huaban.com/${item?.file?.key}`;
};
const getImage = async () => {
  const res = await proxy.$axios(
    "https://api.huaban.com/search/file?text=迪丽热巴&sort=all&limit=20&page=3&position=search_pin"
  );
  parseHtml(res.data);
};
const parseHtml = (list: Array<any>) => {
  state.beautyList.push(...list?.pins);
};
const onDownLoad = () => {};

onMounted(() => {
  getImage();
});
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
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: auto;

    .image {
      width: 200px;
      height: 200px;
      margin: 20px;
      border-radius: 10px;
      overflow: hidden;
      /deep/ img {
        display: block;
        width: 200px !important;
      }
    }
  }
}
</style>
