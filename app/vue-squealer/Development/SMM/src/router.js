import {createRouter, createWebHashHistory} from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import SignIn from "./components/SignIn.vue";

const routes = [
    { path : '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/signIn', name: 'Sign In', component: SignIn }
]

const  router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;