import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#200f5d',
        secondary: '#161734',
        accent: '#087ca7',
        error: '#f44336',
        warning: '#ff9800',
        info: '#00bcd4',
        success: '#8bc34a',
        navbar: '#200f5d'
      },
      dark: {
        primary: '#087ca7',
        secondary: '#087ca7',
        accent: '#82857f',
        error: '#f44336',
        warning: '#ff9800',
        info: '#00bcd4',
        success: '#8bc34a',
        navbar: '#1e1e1e'
      }
    },
  },
});
