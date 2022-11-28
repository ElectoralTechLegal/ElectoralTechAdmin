<template>
  <div>
    <CustomNavbar></CustomNavbar>
    <CustomMenu></CustomMenu>
    <v-main>
      <div style="min-height: 4px;">
        <v-progress-linear :active="loading" color="secondary" :indeterminate="indeterminate"></v-progress-linear>
      </div>
      <v-container fluid class="fill-height">
        <v-breadcrumbs :items="breadItems">
        </v-breadcrumbs>
          <div class='fill-content'>
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
      </v-container>
      <v-snackbar v-model="taskComputed" :timeout=timeout :top="top" :right="right" :color="color">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="setTaskCompleted(false)">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </div>
</template>

<script>
import CustomMenu from "@/components/dashboard/menu";
import CustomNavbar from "@/components/dashboard/navbar";
import {mapMutations, mapState} from "vuex";

export default {
  name: "dashboard",
  mounted() {
    this.configDarkMode();
  },
  components: {
    CustomMenu,
    CustomNavbar,
  },
  /* watch: {
    $route(to, from) {
      // react to route changes...
      console.log(this.$route.path, to, from)
    }
  }, */
  computed: {
    ...mapState('settingsModule',
        [
          'loading',
          'taskCompleted',
          'message',
          'color',
          'breadItems'
        ]),
    taskComputed: {
      get () {
        return this.taskCompleted
      },
      set (value) {
        this.setTaskCompleted(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setDarkMode: 'settingsModule/setDarkMode',
      setTaskCompleted: 'settingsModule/setModal',
    }),
    configDarkMode() {
      let band = localStorage.getItem("darkMode");
      if (band === 'true') {
        console.log('Dark mode habilitado');
        this.setDarkMode(true);
        this.$vuetify.theme.dark = true;
      } else {
        this.setDarkMode(false);
        this.$vuetify.theme.dark = false;
      }
    },
  },
  data: () => ({
    active: true,
    indeterminate: true,
    right: true,
    top: true,
    timeout: 1800
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fill-content {
  margin-top: 0;
  width: 100%;
}
</style>