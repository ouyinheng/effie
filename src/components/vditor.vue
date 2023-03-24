<template>
  <div class="more-bar">
    <a-dropdown>
      <span class="iconfont icon-xuanxiang"></span>
      <template #content>
        <a-doption @click="togglePreview">
          <template #icon>
            <span class="iconfont icon-chakan"></span>
          </template>
          <template #default>只读</template>
        </a-doption>
      </template>
    </a-dropdown>
  </div>
  <div
    class="vidtor-group"
    :class="{
      effie: effieTheme
    }"
  >
    <div class="vditor-preview" v-if="state.showPreview" v-html="state.previewHtml"></div>
    <div v-else id="vditor" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, onDeactivated, reactive, ref, watch, nextTick } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { useCounterStore } from "@/stores/counter";

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
    editorValue(val) {
      if (this.state?.vditor) this.state?.vditor?.setValue(this.editorValue || "");
    }
  },
  setup(props: any, { emit }) {
    const state: any = reactive({
      vditor: Vditor || null,
      setTimeout: null,
      showPreview: false,
      previewHtml: "",
      morevalue: "",
      moreOptions: [
        {
          label: "只读",
          value: "preview"
        }
      ]
    });
    const store: any = useCounterStore();
    watch(
      () => store.state.selectdoc,
      () => {
        try {
          state?.vditor?.setValue(props.editorValue || "");
        } catch (error) {}
      },
      { deep: true }
    );
    watch(
      () => state.showPreview,
      (val) => {
        console.log("val", val);
        if (!val) {
          nextTick(() => {
            renderVditor();
          });
        }
      }
    );
    const saveDocData = () => {
      if (state.setTimeout) clearTimeout(state.setTimeout);
      state.setTimeout = setTimeout(() => {
        state.previewHtml = state.vditor.getHTML();
        emit("saveDocData", state.vditor.getValue());
      }, 500);
    };

    const togglePreview = () => {
      state.showPreview = ref(!state.showPreview);
    };

    const renderVditor = () => {
      console.log("test");
      state.vditor = new Vditor("vditor", {
        mode: props.editorConfig?.mode,
        after: () => {
          state.vditor.setValue(props.editorValue);
          state.previewHtml = state.vditor.getHTML();
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
          "fullscreen"
        ]
      });
      const vidtorGroup = document.querySelector(".vidtor-group");
      if (vidtorGroup) vidtorGroup.addEventListener("keyup", saveDocData);
    };

    onMounted(() => {
      renderVditor();
    });
    onDeactivated(() => {
      const vidtorGroup = document.querySelector(".vidtor-group");
      if (vidtorGroup) vidtorGroup.removeEventListener("keyup", saveDocData);
    });
    return {
      state,
      togglePreview,
      renderVditor
    };
  }
});
</script>

<style lang="less" scoped>
.more-bar {
  width: 100px;
  height: 20px;
  position: fixed;
  right: -50px;
  top: 15px;
  z-index: 999;
  .icon-xuanxiang {
    font-size: 16px;
    color: black;
    cursor: pointer;
  }
}
.vidtor-group {
  border: none;
  width: 100% !important;
  height: 100% !important;
  position: relative;
  .hide {
    opacity: 0;
  }
}
.vditor-preview {
  width: 100% !important;
  height: 100% !important;
  .scrollMixins();
  overflow: auto;
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
    .vditor-ir,
    .vditor-wysiwyg {
      pre.vditor-reset {
        background-color: #ffffff;
        .scrollMixins();
      }
    }
  }
}
</style>
