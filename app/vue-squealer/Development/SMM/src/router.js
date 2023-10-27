import {createRouter, createWebHashHistory} from 'vue-router';
import Login from './components/Login.vue';
import DashBoard from "./components/dashboard/DashBoard.vue";
import Home from "./components/dashboard/Home.vue";

const routes = [

    {
        path : '/',
        name: 'Login',
        component: Login,
    },

    {
        path: '/dashboard',
        name: 'Smm-DashBoard',
        component: DashBoard,
    },
]

const  router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;