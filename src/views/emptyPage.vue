<template>
  <div class="empty-page flex-around flex-center">
    <div class="center-box">
      <span class="empty-tip">没有选中的文稿</span>
      <div class="default-btn mt-10">新建文稿</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import initdb from "@elec/sql/initdb";
initdb.createFile();
initdb.init("setup.json");
const addFile = () => {
  initdb.getData((db: any) => {});
};
</script>

<style lang="less" scoped>
.empty-tip {
  font-size: 18px;
  text-align: center;
}
.default-btn {
  margin: 10px auto 0;
  max-width: 65px;
  border: 2px solid #d1d1d1;
  border-radius: 5px;
  font-size: 16px;
  padding: 0px 20px;
  user-select: none;
  background-color: #e8e8e8;
  &:hover {
    background-color: #d1d1d1;
  }
}
.empty-page {
  width: 100%;
  height: 100%;
  color: #6d6d71;
  background-color: #e8e8e8;
  text-align: center;
  .center-box {
    width: 200px;
  }
}
</style>
