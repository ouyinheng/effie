<template>
  <a-modal
    class="select-folder"
    v-model:visible="state.showModal"
    :mask-closable="false"
    :close-on-esc="false"
    :hide-cancel="true"
    :closable="false"
  >
    <template #title> 选择文件保存地址 </template>
    <div>
      <div>
        <a-input v-model="state.saveFileUrl" readonly placeholder="请选择">
          <template #append>
            <a-button type="primary" @click="showUpload">选 择</a-button>
          </template>
        </a-input>
      </div>
    </div>
    <template #footer>
      <a-button :disabled="btnDisabled" type="primary" @click="submitCallback">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, computed } from "vue";
const { ipcRenderer: ipc } = require("electron");

export default defineComponent({
  props: {
    value: Boolean
  },
  watch: {},
  setup(props, ctx) {
    const state = reactive({
      showModal: false,
      saveFileUrl: "",
      okButtonProps: {
        disable: true
      }
    });
    const btnDisabled = computed(() => {
      return !state.saveFileUrl;
    });
    const showUpload = async () => {
      const res = await ipc.invoke("selectFolder");
      console.log("res", res[0]);
      state.saveFileUrl = res[0];
    };

    const submitCallback = () => {
      console.log("state.saveFileUrl", state.saveFileUrl);
      if (!state.saveFileUrl) return;
      localStorage.saveFileUrl = state.saveFileUrl;
      window.global.saveFileUrl = localStorage.saveFileUrl;
      state.showModal = false;
      ctx.emit("start");
    };

    //
    state.showModal = props.value;
    return {
      state,
      btnDisabled,
      showUpload,
      submitCallback
    };
  }
});
</script>

<style lang="less">
.select-folder {
  .arco-input-prepend,
  .arco-input-append {
    padding: 0 !important;
  }
}
</style>
