<template>
  <div class="setup">
    <div class="drag-bar">
      <span class="shouqi iconfont icon-jiantou_xiangzuoliangci" @click="back"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

let router = useRouter();

const back = () => {
  router.back();
};
</script>

<style lang="less" scoped>
.setup {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 10px;
  position: relative;
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
</style>
