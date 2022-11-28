import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './theme/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'

Vue.config.productionTip = false

Vue.use(Vuelidate)


auth.onAuthStateChanged(user => {

  if (user) {
    console.log('valid user')
    /* if (!user.emailVerified) {
        store.dispatch('auth/verfiyEmail');
    } */
    const usuario = JSON.parse(sessionStorage.getItem('user'));
    store.commit('authModule/setUsuario', usuario);
  } else {
    console.log('invalid user ', user)
    //store.dispatch('detectarUsuario', user)
  }

})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
