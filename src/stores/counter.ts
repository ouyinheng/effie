import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const state: any = reactive({
    activeItem: "全部", // 激活的文件夹
    selectdoc: null, //选中的文件
    fileList: [],
    mkData: ""
  });
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }
  function setActiveItem(val: string) {
    state.activeItem = val;
  }
  function setFileListData(list: Array<any>) {
    state.fileList = list;
  }
  function setSelectDoc(doc: any) {
    state.selectdoc = doc;
  }
  function setMkData(mkData: string) {
    state.mkData = mkData;
  }
  return { count, state, doubleCount, increment, setActiveItem, setFileListData, setSelectDoc, setMkData };
});
