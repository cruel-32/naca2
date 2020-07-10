import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './stores'
import './registerServiceWorker'
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import Clipboard from 'v-clipboard'

Vue.use(Vuetify, {
  theme: {
    primary: "#FF6D00",
    secondary: "#e57373",
    accent: "#9c27b0",
    error: "#D50000",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  }
});

Vue.use(VeeValidate);
Vue.use(require('vue-moment'));
Vue.use(Clipboard);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
