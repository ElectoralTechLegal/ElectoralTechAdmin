<template>
  <v-app-bar app dark clipped-left elevation="7" color="navbar">
    <v-app-bar-nav-icon @click="drawer"></v-app-bar-nav-icon>
    <span class="title ml-3 mr-5 d-none d-lg-block">Panel de administración - Electoral Tech </span>
    <span class="title d-flex d-sm-none">Electoral Tech</span>
    <!-- en caso de que se requiera la barra de busqueda -->
    <!-- <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search"></v-text-field> -->

    <v-spacer></v-spacer>
    <v-menu left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list botom>
        <v-list-item @click="logOut()">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>

          <v-list-item-content >
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import { auth } from '../../firebase';

export default{
  name: 'CustomNavbar',
  data () {
    return {
      active: true
    }
  },
  computed: {
    ...mapGetters({
      drawerState: 'settingsModule/getDrawerState'
    })
  },
  methods: {
    ...mapMutations({
      setDrawer: 'settingsModule/setDrawerOpen'
    }),
    drawer () {
      let temp = this.drawerState
      this.setDrawer(!temp)
    },
    logOut () {
      sessionStorage.removeItem('user')
      this.$router.push({name: 'logIn'})
      auth.signOut();
    }
  }
};

</script>