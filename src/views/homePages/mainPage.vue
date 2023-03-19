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
const activeItem = computed(() => {
  const activeItem = store.state.activeItem === "全部" ? store.state.selectdoc.parent : store.state.activeItem;
  return activeItem;
});

const saveDocData = (value: string) => {
  initdb.createDoc(`doc/${activeItem.value}/${store.state.selectdoc.name}`, value);
};
const getDocData = () => {
  if (!store.state.selectdoc?.name || !store.state.activeItem) return;
  const data = initdb.readDoc(`doc/${activeItem.value}/${store.state.selectdoc.name}`);
  state.editorValue = data;
  state.showVditor = true;
};

watch(
  () => store.state,
  () => {
    if (["搜索", "废纸篓"].includes(store.state.activeItem)) return;
    getDocData();
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  const preview = $route.query.preview;
  if (preview) state.preview = String(preview);
});
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 5px 10px 20px;
  -webkit-app-region: no-drag;
}
</style>
