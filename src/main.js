import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid';

Vue.config.productionTip = false
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入全局样式表
import '@/assets/css/global.css'


Vue.component('tree-table', TreeTable)

// import axios from 'axios'
// 配置请求的跟路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888'
// Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
