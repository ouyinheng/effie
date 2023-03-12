<template>
  <div
    class="vidtor-group"
    :class="{
      effie: effieTheme
    }"
  >
    <div id="vditor" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, onDeactivated, watch, reactive, computed } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
export default defineComponent({
  props: {
    editorConfig: {
      type: Object,
      default: () => ({
        mode: "wysiwyg", // wysiwyg; ir; sv;
        hide: false
      })
    },
    effieTheme: {
      type: Boolean,
      default: true
    },
    editorValue: {
      type: String,
      default: "Vue Composition API + Vditor + TypeScript Minimal Example"
    },
    preview: {
      type: String,
      default: "false"
    }
  },
  watch: {
    editorValue() {
      this.state?.vditor.setValue(this.editorValue);
    }
  },
  setup(props: any, { emit }) {
    const state: any = reactive({
      vditor: Vditor || null,
      setTimeout: null
    });
    const saveDocData = () => {
      if (state.setTimeout) clearTimeout(state.setTimeout);
      state.setTimeout = setTimeout(() => {
        emit("saveDocData", state.vditor.getValue());
      }, 500);
    };
    window.addEventListener("keyup", saveDocData);
    onMounted(() => {
      state.vditor = new Vditor("vditor", {
        mode: props.editorConfig?.mode,
        after: () => {
          state.vditor.setValue(props.editorValue);
        },
        toolbarConfig: {
          hide: props.editorConfig.hide
        },
        toolbar: [
          "emoji",
          "headings",
          "bold",
          "italic",
          "strike",
          "link",
          "|",
          "list",
          "ordered-list",
          "check",
          "outdent",
          "indent",
          "|",
          "quote",
          "line",
          "code",
          "inline-code",
          "insert-before",
          "insert-after",
          "|",
          "table",
          "|",
          "undo",
          "redo",
          "|",
          "fullscreen",
          "edit-mode",
          {
            name: "export",
            tipPosition: "s",
            tip: "导出",
            className: "right",
            click() {}
          }
        ]
      });
    });
    onDeactivated(() => {
      window.removeEventListener("keyup", saveDocData);
    });
    return {
      state
    };
  }
});
</script>

<style lang="less" scoped>
.vidtor-group {
  border: none;
  width: 100% !important;
  height: 100% !important;
  position: relative;
}
#vditor {
  border: none;
  width: 100% !important;
  height: 100% !important;
  /deep/ .vditor-toolbar {
    // display: none !important;
    padding: 20px 10px 0 !important;
    background-color: white;
  }
  /deep/ .vditor-content {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .vditor-ir {
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }
    .vditor-ir pre.vditor-reset {
      background-color: #ffffff;
      .scrollMixins();
    }
  }
}
</style>
