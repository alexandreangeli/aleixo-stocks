import Vue from 'vue';
import App from './App.vue';
import { store } from './store/store'
import { router } from './router/router'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate);

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
