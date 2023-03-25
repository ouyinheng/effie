import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import naive from "naive-ui";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@/assets/main.css";
// 引入主题
import "@/assets/theme/index.less";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import "@arco-design/web-vue/dist/arco.css";
import ContextMenu from "@imengyu/vue3-context-menu";
import utils from "@/utils/utils";
import axios from "axios";

const app = createApp(App);

app.provide("$utils", utils);
app.use(createPinia());
app.use(router);
app.use(ContextMenu);
app.use(naive);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.mount("#app");

app.config.globalProperties.$axios = axios;
