import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import ToastPlugin from "vue-toast-notification";

createApp(App)
    .use(router)
    .use(store)
    .use(ToastPlugin)
    .mount("#app");
