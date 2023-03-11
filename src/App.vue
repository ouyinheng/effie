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
          <n-input v-model:value="state.saveFileUrl" type="text" placeholder="请输入文件的保存地址" />
        </div>
        <template #footer>
          <div class="footer">
            <n-button type="primary" :disabled="btnDisabled" @click="submitCallback"> 确定 </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <RouterView v-if="!state.showModal" />
  </div>
</template>
<script setup lang="ts">
import loading from "naive-ui/es/_internal/loading";
import { computed, reactive } from "vue";
import { RouterView } from "vue-router";
const state = reactive({
  showModal: true,
  saveFileUrl: ""
});
const btnDisabled = computed(() => {
  return !state.saveFileUrl;
});
const submitCallback = () => {
  localStorage.saveFileUrl = state.saveFileUrl;
  window.global.saveFileUrl = localStorage.saveFileUrl;
  state.showModal = false;
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
  /deep/ .n-card__content {
    padding: 20px 20px;
  }
  /deep/ .n-card__footer {
    padding: 0 20px 10px;
  }
}
/deep/ .footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}
</style>
