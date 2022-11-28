<template>
  <div style="height: 100%">
    <v-app-bar app dark clipped-left elevation="7" color="primary">
      <span class="text-md-h6 text-sm-overline text-caption">
        Electoral Tech
      </span>
    </v-app-bar>
    <v-main fill-height style="height: 100%">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col lg="4" sm="6">
            <v-card>
              <v-list-item three-line class="logInHeader">
                <v-list-item-content>
                  <div class="overline mb-4 white--text">Identificate</div>
                  <v-list-item-title class="headline mb-1 white--text"
                    >Panel administrativo</v-list-item-title
                  >
                </v-list-item-content>

                <v-list-item-avatar tile size="80" color="#616161">
                  <!-- <v-icon dark> mdi-login-variant </v-icon> -->
                  <v-img :src="`${require('@/assets/back.jpg')}`"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field
                      aria-autocomplete="false"
                      color="secondary"
                      v-model="correo"
                      :loading="cargandoData"
                      :disabled="cargandoData"
                      label="Correo"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      aria-autocomplete="false"
                      type="password"
                      color="secondary"
                      v-model="pass"
                      :counter="20"
                      :loading="cargandoData"
                      :disabled="cargandoData"
                      label="Password"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col>
                    <v-btn
                      block
                      color="secondary"
                      @click="initSesion"
                      :loading="cargandoData"
                      :disabled="!formValid"
                    >
                      Iniciar Sesión
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar
      v-model="taskComputed"
      :timeout="timeout"
      :top="top"
      :right="right"
      :color="color"
      elevation="24"
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="taskComputed = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { auth, fr } from "../../firebase";

export default {
  name: "LogIn",
  mounted() {},
  data() {
    return {
      cargandoData: false,
      correo: "",
      pass: "",
      active: true,
      indeterminate: true,
      right: true,
      top: true,
      timeout: 1800,
      taskComputed: false,
      color: "red darken-4",
      message: "",
    };
  },
  computed: {
    ...mapState("authModule", ["logInError"]),
    formValid () {
      return this.correo != '' && this.pass != '';
    }
  },
  methods: {
    ...mapMutations({
      setUsuario : "authModule/setUsuario"
    }),
    async validateUser() {
      if (auth.currentUser.uid) {
        const doc = await fr.collection("usuarios").doc(auth.currentUser.uid).get();
        if( doc.exists ) {
          const data = doc.data()
          if( data.rol == 1 ){
            console.log( data )
            sessionStorage.setItem('user', JSON.stringify(data));
            this.$router.push({ name: "home" });
          }else {
            // console.warn('usuario sin registro')
            this.taskComputed = true;
            this.message = "Usuario o password incorrectos";
          }
        }
      } else{
        this.taskComputed = true;
        this.message = "Usuario con registro incompleto";
        console.warn('No hay sesion iniciada')
      }
    },
    async initSesion() {
      this.cargandoData = true;
      auth
        .signInWithEmailAndPassword(this.correo, this.pass)
        .then(async (res) => {
          console.log(res);
          // this.$router.push({ name: "home" });
          await this.validateUser()
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/wrong-password") {
            this.taskComputed = true;
            this.message = "Usuario o password incorrecto";
          } else if(errorCode === "auth/invalid-email") {
            this.taskComputed = true;
            this.message = "Correo invalido";
          }else {
            this.taskComputed = true;
            this.message = "Error de conexión";
            console.log(errorMessage);
          }
          console.log(error);
        })
        .finally(() => {
          this.cargandoData = false;
        });
    },
    
  },
};
</script>

<style scoped>
.logInCard {
  margin-top: 14%;
}
.logInHeader {
  background: #161734;
  color: white;
}
.backDiv {
  height: 100%;
}
.footer {
  margin-bottom: 0;
}
</style>