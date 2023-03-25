<template>
  <div
    class="bar-item flex flex-center"
    :class="{
      'active-item': active
    }"
  >
    <span v-if="icon" class="iconfont" :class="[icon]"></span>
    <span class="name ml-5">
      <span>{{ name }}</span>
      <a-spin v-show="loading" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, onMounted } from "vue";

export default defineComponent({
  props: {
    name: String,
    active: Boolean,
    icon: String,
    loading: Boolean
  },
  setup(props, contex) {
    // console.log("---", props);
  },
  onMounted() {
    // console.log(this.$props);
  }
});
</script>

<style lang="less" scoped>
.bar-item {
  width: 100%;
  padding: 0px 10px;
  margin-bottom: 5px;
  box-sizing: border-box;
  user-select: none;
  .arco-spin-icon {
    line-height: 20px;
  }
  span.name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  &:hover {
    background-color: #c2c4c6;
    border-radius: 5px;
  }
}
.active-item {
  background-color: #c2c4c6;
  border-radius: 5px;
}
</style>
