import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/allcss.css'
import request from "@/utils/request";
import store from './store/store'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.request = request
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


