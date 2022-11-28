<template>
  <v-navigation-drawer v-model="drawer" app clipped>
    <v-card elevation="1" color="#1e1e1e">
      <v-img class="white--text align-end"
        :src="`${require('@/assets/perfil.jpg')}`">
        <v-card-title>
          <v-avatar color="secondary" size="36">
            <span class="white--text headline">{{ inicialNombre }}</span>
          </v-avatar>
          <span style="margin-left: 5px">{{ nombreMenu }}</span>
          <v-spacer></v-spacer>
          <v-btn color="dark" @click="darkMode" fab small>
            <transition name="fade" mode="out-in">
              <v-icon key="nigth" v-if="!isDarkMode">mdi-weather-night</v-icon>
              <v-icon key="day" v-else>mdi-white-balance-sunny</v-icon>
            </transition>
          </v-btn>
        </v-card-title>
      </v-img>
    </v-card>
    <v-list nav>
      <!-- Si el item tiene menus hijos se necesita un listGroup -->
      <template v-for="item in items">
        <v-list-group
          v-if="item.items.length > 0"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
          color="secondary"
        >
          <!-- Se crea el encabezado del menu -->
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <!--Si el menu tiene hijos se crean aqui -->

          <v-list-item
            :class="classItemMenu(subItem.ruta, $route.path)"
            v-for="subItem in item.items"
            :key="subItem.title"
            @click="irMenus(subItem.nameR)"
          >
            <v-list-item-icon>
              <v-icon
                v-text="subItem.action"
                :class="subItem.ruta === $route.path ? 'highlighted-icon' : ''"
              ></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- Cuando un menu principal no tiene hijos -->
        <template v-else>
          <v-list-item
            @click="irMenus(item.nameR)"
            :key="item.title"
            :class="classItemMenu(item.ruta, $route.path)"
          >
            <v-list-item-icon>
              <v-icon
                v-text="item.action"
                :class="item.ruta === $route.path ? 'highlighted-icon' : ''"
              ></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script >
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "CustomMenu",
  data() {
    return {
      menuSeleccionado: "",
      active: "",
      items: [
        {
          action: "home",
          title: "Inicio",
          items: [],
          ruta: "/home",
          active: true,
          nameR: "home",
        },
        {
          action: "mdi-application-edit",
          title: "Blog",
          items: [],
          ruta: "/blog",
          active: false,
          nameR: "blog",
        },
        {
          action: "mdi-link-box-variant",
          title: "E-Learning",
          items: [],
          ruta: "/elearning",
          active: false,
          nameR: "elearning",
        },
        {
          action: "mdi-toolbox-outline",
          title: "Servicios",
          items: [],
          ruta: "/servicios",
          active: false,
          nameR: "servicios",
        },
        {
          action: "mdi-account-cog",
          title: "Acceso a Market",
          items: [],
          ruta: "/accesoMarket",
          active: false,
          nameR: "accesoMarket",
        },
        {
          action: "mdi-file-document-multiple-outline",
          title: "Electoral Search",
          items: [],
          ruta: "/electoralSearch",
          active: false,
          nameR: "electoralSearch",
        },
        {
          action: "mdi-cash-multiple",
          title: "Facturacion",
          items: [],
          ruta: "/facturacion",
          active: false,
          nameR: "facturacion",
        },
        {
          action: "mdi-email-fast",
          title: "Fidelización",
          items: [],
          ruta: "/fidelizacion",
          active: false,
          nameR: "fidelizacion",
        },
        {
          action: "mdi-folder-upload-outline",
          title: "Documentos",
          items: [],
          ruta: "/documentos",
          active: false,
          nameR: "documentos",
        }

      ],
    };
  },
  methods: {
    ...mapMutations({
      setDrawer: "settingsModule/setDrawerOpen",
      setDarkMode: "settingsModule/setDarkMode",
    }),
    irMenus(namedRoute) {
      this.active = true;
      // console.log("ir al menu " + namedRoute);
      this.$router.push({ name: namedRoute });
    },
    darkMode() {
      // esta habilitado
      if (this.isDarkMode) {
        this.$vuetify.theme.dark = false;
        this.setDarkMode(false);
        localStorage.setItem("darkMode", false);
      } else {
        localStorage.setItem("darkMode", true);
        this.$vuetify.theme.dark = true;
        this.setDarkMode(true);
      }
    },
    classItemMenu(ruta, routerpath) {
      // console.info( ruta+ ' - ' + routerpath)
      return {
        "highlighted-dark": this.isDarkMode && ruta == routerpath,
        "highlighted-ligth": !this.isDarkMode && ruta == routerpath,
      };
    },
  },
  computed: {
    ...mapGetters({
      getDrawer: "settingsModule/getDrawerState",
      isDarkMode: "settingsModule/getDarkMode",
    }),
    ...mapState("authModule", ["usuarioLog"]),
    drawer: {
      get() {
        return this.getDrawer;
      },
      set(value) {
        this.setDrawer(value);
      },
    },
    nombreMenu() {
      return this.usuarioLog.nombre;
    },
    inicialNombre() {
      return this.usuarioLog.nombre ? this.usuarioLog.nombre[0] : '';
    }
  },
};
</script>

<style scoped>
.v-application--is-ltr
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding-left: 47px;
}
a {
  text-decoration: none;
}
.v-application a {
  color: #393939;
}
.router-link-active-ligth {
  color: #03045e !important;
}
.router-link-active-dark {
  color: lightseagreen !important;
}

.highlighted-ligth {
  background: #ddd;
}

.highlighted-dark {
  background: rgb(30 30 30);
}

.highlighted-icon-ligth {
  color: #03045e !important;
}

.highlighted-icon-dark {
  color: red !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>