<template>
  <div>
    <v-dialog v-model="detalleCancel" persistent max-width="600">
      <v-card class="mx-auto">
        <v-carousel
          reverse-transition="fade-transition"
          transition="fade-transition"
          height="300"
        >
          <v-carousel-item>
            <v-img
              :src="consulta.prueba1"
              lazy-src="https://picsum.photos/id/11/100/60"
              alt="Prueba motivo de cancelación"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-carousel-item>
          <v-carousel-item>
            <v-img
              :src="consulta.prueba2"
              lazy-src="https://picsum.photos/id/11/100/60"
              alt="Prueba motivo de cancelación"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-carousel-item>
        </v-carousel>
        <v-card-text>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="indigo">
                  <v-icon dark> mdi-account-circle </v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title> {{ consulta.tercero }}</v-list-item-title>
                <v-list-item-subtitle>Resposable</v-list-item-subtitle>
                <v-list-item-subtitle>
                  Costo: ${{ consulta.costo }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-title> Fechas</v-list-item-title>
                <v-list-item-subtitle>
                  Pago: {{ fechaFormato(consulta.fechaVoucher) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Cancelación: {{ fechaFormato(consulta.fechaCancelacion) }}
                </v-list-item-subtitle>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="indigo">
                  <v-icon dark> mdi-account-circle </v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ consulta.usuario.nombre }} {{ consulta.usuario.apellidos }}
                </v-list-item-title>
                <v-list-item-subtitle>Cliente</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-title> Contacto </v-list-item-title>
                <v-list-item-subtitle>
                  {{ consulta.usuario.correo }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ consulta.numero }}
                </v-list-item-subtitle>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <b>Consulta</b>
          <p>
            {{ consulta.consulta }}
          </p>
          <b>Motivo de cancelación</b>
          <p>
            {{ consulta.motivoCancelacion }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="setCancelDialogDet(false)">
            aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import fn from "../lib/index";

export default {
  name: "DetalleCancel",
  props: {
    consulta: Object,
  },
  data() {
    return {
      fechaFormato(mil) {
        return fn.fechaFormato(mil);
      },
    };
  },
  methods: {
    ...mapMutations({
      setCancelDialogDet: "generalsModule/setCancelDialogDet",
    }),
  },
  computed: {
    ...mapState("generalsModule", ["detalleCancel"]),
  },
};
</script>