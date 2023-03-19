<template>
  <div class="home-page">
    <n-modal
      class="save-dialog"
      v-model:show="state.showModal"
      :mask-closable="false"
      :close-on-esc="false"
      :auto-focus="false"
    >
      <n-card style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div>
          <n-input-group>
            <n-input v-model:value="state.saveFileUrl" readonly type="text" placeholder="请输入文件的保存地址" />
            <n-button type="primary" ghost @click="showUpload"> 选择 </n-button>
          </n-input-group>
        </div>
        <template #footer>
          <div class="footer">
            <n-button type="primary" :disabled="btnDisabled" @click="submitCallback"> 确定 </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <transition-group name="list" mode="fade-in">
      <RouterView v-if="!state.showModal" />
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { RouterView } from "vue-router";
const { ipcRenderer: ipc } = require("electron");
const state = reactive({
  showModal: true,
  saveFileUrl: "",
  inputValue: null
});
const btnDisabled = computed(() => {
  return !state.saveFileUrl;
});
const submitCallback = () => {
  localStorage.saveFileUrl = state.saveFileUrl;
  window.global.saveFileUrl = localStorage.saveFileUrl;
  state.showModal = false;
};
const showUpload = async () => {
  const res = await ipc.invoke("selectFolder");
  state.saveFileUrl = res[0];
};
if (localStorage.saveFileUrl) {
  window.global.saveFileUrl = localStorage.saveFileUrl;
  state.showModal = false;
}
</script>
<style lang="less" scoped>
.home-page {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  overflow: hidden;
}
.save-dialog {
  width: 500px !important;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  /deep/ .n-card__content {
    padding: 20px 20px;
  }
  /deep/ .n-card__footer {
    padding: 0 20px 10px;
  }
}
/deep/ .n-modal-mask {
  background-color: pink !important;
}
/deep/ .footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}
</style>
