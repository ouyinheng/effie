<template>
  <div class="main-page">
    <vditor
      v-if="state.showVditor"
      @saveDocData="saveDocData"
      :preview="state.preview"
      :editorValue="state.editorValue"
    />
    <!-- <previewVditor></previewVditor> -->
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import vditor from "@/components/vditor.vue";
import previewVditor from "@/components/previewVditor.vue";
import initdb from "@elec/sql/initdb";
import { useCounterStore } from "@/stores/counter";

const $route = useRoute();
const state: any = reactive({
  editorValue: "",
  showVditor: false,
  preview: "false"
});
const store: any = useCounterStore();

// computed

const saveDocData = (value: string) => {
  initdb.createDoc(`doc/${store.state.activeItem}/${store.state.selectdoc.name}`, value);
};
const getDocData = () => {
  if (!store.state.selectdoc?.name || !store.state.activeItem) return;
  const data = initdb.readDoc(`doc/${store.state.activeItem}/${store.state.selectdoc.name}`);
  state.editorValue = data;
  state.showVditor = true;
};

watch(
  () => store.state,
  () => {
    if (["搜索", "全部", "废纸篓"].includes(store.state.activeItem)) return;
    getDocData();
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  const { preview } = $route.query;
  state.preview = String(preview);
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
