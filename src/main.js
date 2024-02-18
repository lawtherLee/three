import { createApp } from "vue";
import "./style.css";
import * as THREE from "three";
import App from "./App.vue";
const app = createApp(App);
app.config.globalProperties.$THREE = THREE;
app.mount("#app");
