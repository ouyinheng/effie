<template>
  <div class="vidtor-group">
    <div id="vditor" />
    <div class="modal" v-if="preview === 'false'"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, onDeactivated, watch } from "vue";
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
    const vditor = ref<Vditor | null>(null);
    const saveDocData = () => {
      emit("saveDocData", vditor.value!.getValue());
    };
    window.addEventListener("keyup", saveDocData);
    watch(
      () => props.editorValue,
      () => {
        vditor.value!.setValue(props.editorValue);
      }
    );
    onMounted(() => {
      vditor.value = new Vditor("vditor", {
        mode: "ir",

        after: () => {
          // vditor.value is a instance of Vditor now and thus can be safely used here
          vditor.value!.setValue(props.editorValue);
        }
      });
      // vditor.value.setPreviewMode("both");
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
