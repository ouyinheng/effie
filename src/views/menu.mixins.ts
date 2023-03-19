import { inject, ref } from "vue";
const $utils: any = inject("$utils");

export function menuEvent() {
  const showExportDialog = ref(false);
  // 导出图片
  const exportImg = (item: any) => {
    console.log("exportImg", item);
  };
  return {
    showExportDialog,
    exportImg
  };
}
