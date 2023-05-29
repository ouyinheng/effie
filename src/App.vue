<template>
  <div class="home-page">
    <select-folder :value="state.showModal" @start="start"></select-folder>
    <transition-group name="list" mode="fade-in">
      <RouterView v-if="!state.showModal" />
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { RouterView } from "vue-router";
import SelectFolder from "./SelectFolder.vue";
const state = reactive({
  showModal: true
});

const start = () => {
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
