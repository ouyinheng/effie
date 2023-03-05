<template>
  <div
    class="bar-item flex flex-center"
    :class="{
      'active-item': active
    }"
  >
    <span class="iconfont" :class="[icon]"></span>
    <span class="name ml-5">{{ name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, onMounted } from "vue";

export default defineComponent({
  props: {
    name: String,
    active: Boolean,
    icon: String
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
