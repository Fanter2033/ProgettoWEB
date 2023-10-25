import {createRouter, createWebHashHistory} from 'vue-router';
import Login from './components/Login.vue';
import SignIn from "./components/SignIn.vue";
import SmmDashBoard from "@/components/SmmDashBoard.vue";

const routes = [
    { path : '/', name: 'Home', component: Login },
    { path: '/login', name: 'Login', component: Login },
    { path: '/signIn', name: 'Sign In', component: SignIn },
    { path: '/dashboard', name: 'Smm DashBoard', component: SmmDashBoard}
]

const  router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;