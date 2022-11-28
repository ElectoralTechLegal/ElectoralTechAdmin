<template>
  <div>
    <v-dialog v-model="userDialogInfo" persistent max-width="350">
      <v-card max-width="375" class="mx-auto">
        <v-img :src="`${require('@/assets/perfil.jpg')}`" height="300px" dark>
          <v-row class="fill-height" align-content="center">
            <v-card-title class="white--text pt-12">
              <div class="title ml-5">{{ usuarioConsulta.nombre }}</div>
              <div class="title ml-1">{{ usuarioConsulta.apellidos }}</div>
            </v-card-title>
          </v-row>
        </v-img>
        <v-card-text>
          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent"> mdi-phone </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  usuarioConsulta.telefono ? usuarioConsulta.telefono : "-"
                }}</v-list-item-title>
                <v-list-item-subtitle>Celular</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-icon>mdi-message-text</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent"> mdi-email </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  usuarioConsulta.correo
                }}</v-list-item-title>
                <v-list-item-subtitle>Correo</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent"> mdi-cash-multiple </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  usuarioConsulta.prime == 1 ? "Miembro Prime" : "Miembro Gratuito"
                }}</v-list-item-title>
                <v-list-item-subtitle>Estado Prime</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-btn
                depressed
                dark
                color="pink"
                @click="AbrirVoucher(usuarioConsulta.id)"
                >
                  Ver Vouncher De Pago
                </v-btn>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent"> mdi-calendar-start </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  usuarioConsulta.prime == 1 ? usuarioConsulta.fecha_inicio_prime : "-"
                }}</v-list-item-title>
                <v-list-item-subtitle>Inicio Suscripcion</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent"> mdi-calendar-remove </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  usuarioConsulta.prime == 1 ? usuarioConsulta.fecha_fin_prime : "-"
                }}</v-list-item-title>
                <v-list-item-subtitle>Fin Suscripcion</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>


          </v-list>
        </v-card-text>
        <v-card-actions center>
          <v-btn color="primary" text @click="closeDialog">
            Aceptar
          </v-btn> 
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { fr } from "../firebase";

export default {
  name: "UserInfoDialog",
  data () {
    return {
      
    }
  },
  methods : {
    ...mapMutations({
      setDialog : 'generalsModule/setDialogState'
    }),
    closeDialog() {
      this.setDialog(false);
    },
    async AbrirVoucher(id){
      console.log(id);
      const suscripcionInfo =  await fr
      .collection("suscripciones").doc(id)
      .get();
      window.open(suscripcionInfo.data().voucherURL, 'Voucher De Pago')
    }

  },
  computed : {
    ...mapState('generalsModule', ['userDialogInfo', 'usuarioConsulta'])
  }
}
</script>