import Vue from 'vue';
import App from './App.vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import components from './utils/register';

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(components);
new Vue({
  render: (h) => h(App),
}).$mount('#app');
