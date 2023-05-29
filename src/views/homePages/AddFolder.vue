<template>
  <a-modal
    v-model:visible="state.dialogVisible"
    :mask-closable="false"
    :closable="false"
    :show-icon="false"
    draggable
    content="你确认"
  >
    <template #title> 请输入文件名 </template>
    <div>
      <a-input v-model.trim="state.folderValue" type="text" placeholder="请输入文件名" />
    </div>
    <template #footer>
      <a-button @click="handleClose('')">取消</a-button>
      <a-button :disabled="confirmDisabled" type="primary" @click="handleConfirm">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, inject, reactive } from "vue";

export default defineComponent({
  props: {
    value: Boolean
  },
  watch: {
    value(val: Boolean) {
      this.state.dialogVisible = val;
    }
  },
  setup(props, ctx) {
    const state: any = reactive({
      dialogVisible: false,
      folderValue: ""
    });
    const confirmDisabled = computed(() => {
      return !state.folderValue.trim()?.length;
    });
    const handleClose = (folderValue = "") => {
      state.dialogVisible = false;
      state.folderValue = "";
      ctx.emit("confirm", folderValue);
    };
    const handleConfirm = () => {
      if (!state.folderValue) return;
      handleClose(state.folderValue);
    };
    state.dialogVisible = props.value;
    return {
      state,
      confirmDisabled,
      handleConfirm,
      handleClose
    };
  }
});
</script>

<style lang="less" scoped></style>
