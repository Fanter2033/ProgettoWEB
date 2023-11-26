import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./components/Login.vue";
import DashBoard from "./components/dashboard/DashBoard.vue";
import Chart from "@/components/dashboard/Chart.vue";
import Quote from "@/components/dashboard/Quote.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
      {
        path: "/dashboard",
        name: "Smm-DashBoard",
        component: DashBoard,
      },
          {
            path: "/dashboard/charts/:vip",
            name: "Chart",
            component: Chart
          },
          {
            path: "/dashboard/quote/:vip",
            name: "Quote",
            component: Quote
          },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

//TODO: guarda vue router guards