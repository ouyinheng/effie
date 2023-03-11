<template>
  <div class="vidtor-group">
    <div id="vditor" />
    <div class="modal" v-if="preview === 'false'"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, onDeactivated, watch, reactive } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
export default defineComponent({
  props: {
    editorValue: {
      type: String,
      default: "Vue Composition API + Vditor + TypeScript Minimal Example"
    },
    preview: {
      type: String,
      default: "false"
    }
  },
  setup(props, { emit }) {
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
    watch(
      () => props.editorValue,
      () => {
        state.vditor.setValue(props.editorValue);
      }
    );
    onMounted(() => {
      state.vditor = new Vditor("vditor", {
        mode: "ir",
        after: () => {
          state.vditor.setValue(props.editorValue);
        }
      });
    });
    onDeactivated(() => {
      window.removeEventListener("keyup", saveDocData);
    });
    return {};
  }
});
</script>

<style lang="less" scoped>
.vidtor-group {
  border: none;
  width: 100% !important;
  height: 100% !important;
  position: relative;
  .modal {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
#vditor {
  border: none;
  width: 100% !important;
  height: 100% !important;
  /deep/ .vditor-toolbar {
    display: none !important;
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
