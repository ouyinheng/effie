<template>
  <a-modal
    class="setup-dialog"
    v-model:visible="showModal"
    :mask-closable="false"
    :closable="false"
    :esc-to-close="false"
    @ok="handleOk"
    @cancel="onAfterLeave"
    draggable
  >
    <n-tabs type="segment" v-model:value="activeTab">
      <n-tab-pane name="Github" tab="Github"> </n-tab-pane>
      <n-tab-pane name="huaban" tab="花瓣"> </n-tab-pane>
      <n-tab-pane name="zhanwei" tab="占位"> </n-tab-pane>
    </n-tabs>
    <github v-if="activeTab === 'Github'"></github>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import github from "./github.vue";
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    github
  },
  watch: {
    value(val) {
      this.showModal = val;
    }
  },
  setup(props, cxt) {
    const showModal = ref(false);
    const activeTab = ref("Github");
    showModal.value = props.value;
    //关闭
    const onAfterLeave = () => {
      showModal.value = false;
      cxt.emit("setValue", false);
    };
    // 确认
    const handleOk = () => {};
    return {
      showModal,
      activeTab,
      onAfterLeave,
      handleOk
    };
  }
});
</script>

<style lang="less">
.setup-dialog {
  .arco-modal {
    width: 60% !important;
    min-width: 500px !important;
    border-radius: 10px;
    .arco-modal-body {
      min-height: 400px;
      max-height: 400px;
      overflow: auto;
    }
  }
}
</style>
