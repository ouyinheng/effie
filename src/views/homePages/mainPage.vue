<template>
  <div class="main-page">
    <vditor @saveDocData="saveDocData" :preview="state.preview" :editorValue="state.editorValue" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import vditor from "@/components/vditor.vue";
import initdb from "@elec/sql/initdb";

const $route = useRoute();
const state: any = reactive({
  editorValue: "",
  activeItem: null,
  name: null,
  preview: "false"
});
const saveDocData = (value: string) => {
  initdb.createDoc(`doc/${state.activeItem}/${state.name}`, value);
};
const getDocData = () => {
  if (!state.name || !state.activeItem) return;
  const data = initdb.readDoc(`doc/${state.activeItem}/${state.name}`);
  state.editorValue = data;
};

watch(
  () => $route.query,
  (newVal, oldVal) => {
    const { name, activeItem, preview } = $route.query;
    console.log("test", String(preview));
    state.name = name;
    state.activeItem = activeItem;
    state.preview = String(preview);
    if (["搜索", "全部", "废纸篓"].includes(state.activeItem)) return;
    getDocData();
  },
  {
    immediate: true
  }
);
onMounted(() => {
  const { name, activeItem } = $route.query;
  state.name = name;
  state.activeItem = activeItem;
});
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  padding: 20px 5px 10px 20px;
  box-sizing: border-box;
}
</style>
