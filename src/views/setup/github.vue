<template>
  <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
    <a-form-item field="name" tooltip="github仓库地址" label="地址">
      <a-input v-model="form.name" placeholder="please enter your username..." />
    </a-form-item>
    <a-form-item field="post" label="SSH">
      <a-input v-model="form.post" placeholder="please enter your post..." />
    </a-form-item>
    <a-form-item field="isRead">
      <a-checkbox v-model="form.isRead"> I have read the manual </a-checkbox>
    </a-form-item>
    <a-form-item>
      <a-button html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
  {{ form }}
</template>

<script lang="ts">
import { reactive, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const form = reactive({
      name: "",
      post: "",
      isRead: false
    });
    const handleSubmit = (data: any) => {
      console.log(data);
    };

    return {
      form,
      handleSubmit
    };
  }
});
</script>
