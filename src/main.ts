import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import naive from "naive-ui";
import "@/assets/main.css";
// 引入主题
import "@/assets/theme/index.less";

import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";
import utils from "@/utils/utils";

const app = createApp(App);

app.provide("$utils", utils);

app.use(createPinia());
app.use(router);
app.use(ContextMenu);
app.use(naive);

app.mount("#app");
