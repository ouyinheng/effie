<template>
  <div class="empty-page flex-around flex-center">
    <div class="center-box">
      <span class="empty-tip">没有选中的文稿</span>
      <div class="default-btn mt-10" v-if="showBtn" @click="addFile">新建文稿</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, inject } from "vue";
import initdb from "@elec/sql/initdb";
import { useCounterStore } from "@/stores/counter";
const store: any = useCounterStore();
const $utils: any = inject("$utils");

const showBtn = computed(() => {
  return store?.state?.activeItem && !["全部", "搜索", "废纸篓"].includes(store.state.activeItem);
});
// 事件
const addFile = () => {
  $utils.addJsonAndFile(initdb, store.state.activeItem);
};
onMounted(() => {
  initdb.init("setup.json");
});
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
