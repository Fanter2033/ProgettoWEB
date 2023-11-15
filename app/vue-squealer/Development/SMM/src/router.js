import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./components/Login.vue";
import DashBoard from "./components/dashboard/DashBoard.vue";
import Graphs from "@/components/dashboard/Graphs.vue";


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
    path: "/dashboard/graphs",
    name: "Graphs",
    component: Graphs
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
