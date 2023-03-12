<template>
  <div class="preview-vditor"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import VditorPreview from "vditor/dist/method.min.js";

export default defineComponent({
  setup() {
    onMounted(() => {
      VditorPreview.mermaidRender(document.querySelector(".preview-vditor"));
      VditorPreview.preview({
        previewElement: document.querySelector(".preview-vditor"),
        markdown: `### test`
      });
    });
  }
});
</script>
