<template>
  <div
    class="doc-item"
    :class="{
      active
    }"
  >
    <div class="add-icon-btn" v-if="emptyBtn">
      <span class="iconfont icon-plus"></span>
    </div>
    <div class="editor-view" v-else>
      <span class="empty-text" v-if="!state.editorValue">空白文档</span>
      <div class="show-mk-text" v-else>
        {{ state.editorValue }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, watch } from "vue";
import initdb from "@elec/sql/initdb";
import vditor from "@/components/vditor.vue";

export default defineComponent({
  props: {
    emptyBtn: {
      type: Boolean,
      default: true
    },
    docData: {
      type: Object,
      default: () => {}
    },
    selectdoc: {
      type: Object,
      default: () => {}
    },
    activeItem: {
      type: String,
      default: ""
    }
  },
  components: {
    vditor
  },
  setup(props) {
    const state = reactive({
      editorValue: ""
    });
    const canAjax = computed(() => {
      return !props.activeItem || !props.selectdoc?.name;
    });
    const active = computed(() => {
      return Boolean(props.selectdoc?.name) && !props.emptyBtn && props.selectdoc?.name === props.docData?.name;
    });

    const getDocValue = () => {
      if (!props.docData?.name) return;
      const activeItem = props.activeItem === "全部" ? props.docData.parent : props.activeItem;
      const data = initdb.readDoc(`doc/${activeItem}/${props.docData.name}`);
      state.editorValue = data;
    };
    onMounted(() => {
      getDocValue();
    });
    return { active, state };
  }
});
</script>

<style lang="less" scoped>
.doc-item {
  width: 240px;
  height: 140px;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  transition: all 0.5s;
  padding: 10px;
  user-select: none;
  &:hover {
    transform: scale(1.03);
  }
  .editor-view {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .empty-text {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 120px;
      color: #6d6d71;
    }
    .show-mk-text {
      font-size: 14px;
      line-height: 26px;
      padding-top: 10px;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      word-break: break-all;
    }
  }
  /deep/ .vditor-sv.vditor-reset,
  /deep/ .vditor-toolbar,
  /deep/ .vditor-preview__action {
    display: none !important;
  }
}
.active {
  background-color: #3478f6;
  color: white;
  .empty-text {
    color: white !important;
  }
  /deep/ .vditor-reset {
    background-color: #3478f6;
    color: white !important;
    & > * {
      color: white !important;
    }
  }
}
.add-icon-btn {
  text-align: center;
  margin: 0 auto;
  line-height: 140px;
  .iconfont {
    font-size: 40px;
    color: #c0c1c3;
  }

  &:hover {
    .iconfont {
      color: #a5a6a7;
    }
  }
}
</style>
