<template>
  <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
    <a-form-item field="name" tooltip="请输入github仓库地址" label="地址">
      <a-input v-model="form.giturl" placeholder="please enter your github url" />
    </a-form-item>
    <!-- <a-form-item field="post" label="SSH">
      <a-input v-model="form.ssh" placeholder="please enter your github ssh" />
    </a-form-item> -->
    <a-form-item>
      <div class="submit-btn">
        <a-button html-type="submit" type="outline" :loading="state.submitLoading" #>
          <span>应 用</span>
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { reactive, defineComponent, onMounted } from "vue";
import setupdb from "@elec/sql/setup";
import { Message } from "@arco-design/web-vue";
import setup from "@elec/sql/setup";
const { ipcRenderer: ipc } = require("electron");

export default defineComponent({
  setup(props) {
    let form = reactive({
      giturl: "",
      ssh: ""
    });
    let state = reactive({
      submitLoading: false
    });
    const handleSubmit = async (data: any) => {
      state.submitLoading = true;
      setupdb.getData((db: any) => {
        db.set("github.giturl", form.giturl).value();
        db.set("github.ssh", form.ssh).value();
        db.write();
      });
      try {
        let res = await ipc.invoke("saveToGit", "git remote -v");
        if (res?.stdout.indexOf(form.giturl) === -1) {
          res = await ipc.invoke("saveToGit", "git init");
          if (res?.error) throw new Error();
          res = await ipc.invoke("saveToGit", `git remote add origin ${form.giturl}`);
          if (res?.error) throw new Error();
        }
        setupdb.getData((db: any) => {
          db.set("github.init", true).value();
          db.write();
        });
        setTimeout(() => {
          state.submitLoading = false;
          Message.success("应用成功");
        }, 1000);
      } catch (error) {
        setTimeout(() => {
          state.submitLoading = false;
          Message.error("应用失败");
        }, 1000);
      }
    };
    onMounted(() => {
      setupdb.init("option.json");
      setupdb.getData((db: any) => {
        const data = db.get("github").value();
        form.giturl = data.giturl;
        form.ssh = data.ssh;
      });
    });
    return {
      state,
      form,
      handleSubmit
    };
  }
});
</script>

<style lang="less" scoped>
.submit-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}
</style>
