import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import axios from 'axios'
import "vue-cropper/dist/index.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
export const BASE_URL = 'http://115.29.41.122:9662';
//export const BASE_URL ='http://localhost:8083'
axios.defaults.baseURL= BASE_URL
axios.defaults.withCredentials = true;
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});
app.mount('#app');
