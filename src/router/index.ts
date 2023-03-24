import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EmptyPage from "@/views/emptyPage.vue";
import MainPage from "@/views//homePages/mainPage.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      props: true,
      children: [
        {
          path: "/home/empty",
          name: "empty",
          props: true,
          component: EmptyPage
        },
        {
          path: "/home/mainPage",
          name: "mainPage",
          component: MainPage
        }
      ]
    },
    {
      path: "/setup",
      name: "setup",
      component: () => import("@/views/setup.vue")
    },
    {
      path: "/rightMenu",
      name: "rightMenu",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/components/rightMenu.vue")
    },
    {
      path: "/picture",
      name: "picture",
      component: () => import("@/views/picture/index.vue")
    }
  ]
});

export default router;
