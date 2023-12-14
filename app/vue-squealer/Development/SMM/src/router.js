import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./components/Login.vue";
import DashBoard from "./components/dashboard/DashBoard.vue";
import Chart from "@/components/dashboard/Chart.vue";
import Quote from "@/components/dashboard/Quote.vue";
import LinkedAccounts from "@/components/LinkedAccounts.vue";
import Squeal from "@/components/dashboard/Squeal.vue"


const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
      {
        path: "/my-vips/",
        name: "My-Vips",
        component: LinkedAccounts,
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
          {
            path: "/dashboard/squeal/:vip",
            name: "Squeal",
            component: Squeal
          }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

//TODO: guarda vue router guards