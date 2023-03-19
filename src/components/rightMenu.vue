<template>
  <context-menu v-model:show="show" :options="optionsComponent">
    <template v-for="(item, index) in menuItem" :key="index">
      <context-menu-group v-if="item.children" :label="showLabel(item)">
        <context-menu-item
          v-for="(ele, eleIndex) in item.children"
          :key="eleIndex"
          :label="showLabel(ele)"
          @click="alertContextMenuItemClicked(ele)"
        />
      </context-menu-group>
      <context-menu-item v-else :label="showLabel(item)" @click="alertContextMenuItemClicked(item)" />
    </template>
  </context-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  type MenuOptions,
  ContextMenu,
  ContextMenuGroup,
  ContextMenuSeparator,
  ContextMenuItem
} from "@imengyu/vue3-context-menu";
interface MenuItem {
  label: String;
  fun?: Function;
  children?: Array<MenuItem>;
}
export default defineComponent({
  props: {
    menuItem: {
      type: Array<MenuItem>,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value() {
      this.show = this.value;
    },
    show() {
      this.$emit("setShow", this.show);
    }
  },
  data() {
    return {
      show: false,
      optionsData: {
        iconFontClass: "iconfont",
        customClass: "class-a",
        zIndex: 3,
        minWidth: 230,
        x: 500,
        y: 200
      } as MenuOptions
    };
  },
  computed: {
    optionsComponent() {
      return Object.assign({}, this.optionsData, this.options);
    }
  },
  components: {
    ContextMenu,
    ContextMenuGroup,
    ContextMenuSeparator,
    ContextMenuItem
  },
  methods: {
    showLabel(item: any) {
      return item?.label || "";
    },
    onContextMenu(e: MouseEvent) {
      e.preventDefault();
      //Set the mouse position
      this.optionsComponent.x = e.x;
      this.optionsComponent.y = e.y;
      //Show menu
      this.show = true;
    },
    alertContextMenuItemClicked(item: any) {
      console.log(item.label);
      item.fun();
    }
  },
  mounted() {
    // this.show = this.value;
  }
});
</script>

<style lang="less"></style>
