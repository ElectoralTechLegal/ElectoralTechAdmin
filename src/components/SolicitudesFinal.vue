
<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="titulo"
          single-line
          color="accent"
          filled
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="data" :search="search">
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu bottom origin="center center" transition="scale-transition">
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  color="primary"
                  text
                  v-bind="attrs"
                  :loading="loading"
                  v-on="{ ...tooltip, ...menu }"
                >
                  Acciones
                </v-btn>
              </template>
              <span> Ver acciones disponibles </span>
            </v-tooltip>
          </template>
          <v-list>

            <v-list-item @click="verDetalle(item)">
              <v-list-item-icon>
                <v-icon>mdi-account-details</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Ver detalle </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="verComprobante(item)">
              <v-list-item-icon>
                <v-icon>mdi-ticket-percent-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Ver comprobante </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="verAvance(item)">
              <v-list-item-icon>
                <v-icon>mdi-timeline-text-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Ver avance </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list>
        </v-menu>
      </template>

      <template v-slot:[`item.estatus`]="{ item }">
        <v-chip :dark="item.estatus == 5"> 
          {{ item.estatus == 5 ? 'Tramite sin exito' : 'Tramite exitoso' }} 
        </v-chip>
      </template>
    </v-data-table>
    <DetalleCompleto></DetalleCompleto>

    <v-divider id="TimeLineAvances"></v-divider>

    <v-container v-if="consulta">
      <v-row align-content="center">
        <v-col cols="12" align-self="center">
          <div class="text-lg-h6 text-sm-h6">Consulta:</div>
          {{ consulta.consulta }}
        </v-col>
      </v-row>
      <v-row align-content="space-between">
        <v-col align-self="start">
          <div class="text-lg-h6 text-sm-h6">Cliente:</div>
          {{ consulta.usuario.nombre }} {{ consulta.usuario.apellidos }}
        </v-col>
        <v-col align-self="end">
          <div class="text-lg-h6 text-sm-h6">Responsable:</div>
          {{ consulta.tercero.text }}
        </v-col>
      </v-row>
      <v-row align-content="center">
        <v-col cols="12" align-self="center">
          <v-sheet class="mx-auto">
            <v-slide-group multiple show-arrows>
              <v-slide-item v-slot="{ active, toggle }">
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="primary white--text"
                  depressed
                  rounded
                  @click="toggle"
                >
                  <v-icon left> mdi-calendar-cursor </v-icon>
                  Fecha registro: {{ consulta.fechaRegistro }}
                </v-btn>
              </v-slide-item>

              <v-slide-item v-slot="{ active, toggle }">
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="primary white--text"
                  depressed
                  rounded
                  @click="toggle"
                >
                  <v-icon left> mdi-calendar-cursor </v-icon>
                  Fecha de atención: {{ consulta.fechaEspera }}
                </v-btn>
              </v-slide-item>

              <v-slide-item v-slot="{ active, toggle }">
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="primary white--text"
                  depressed
                  rounded
                  @click="toggle"
                >
                  <v-icon left> mdi-calendar-cursor </v-icon>
                  Fecha de pago: {{ consulta.fechaVoucher }}
                </v-btn>
              </v-slide-item>

              <v-slide-item v-slot="{ active, toggle }">
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="primary white--text"
                  depressed
                  rounded
                  @click="toggle"
                >
                  <v-icon left> mdi-calendar-cursor </v-icon>
                  Fecha de inicio tramite: {{ consulta.fechaInicioTramite }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
        <v-timeline-item
          v-for="(item, i) in items"
          :key="i"
          color="#28AFB0"
          :icon="item.icon"
          fill-dot
        >
          <v-card color="#37392E" dark>
            <v-card-title class="text-lg-h6 text-sm-h6"
              >{{ item.estatus }} - {{ fechaFormato(item.fecha) }}</v-card-title
            >
            <v-card-text class="white text--primary">
              <p>
                {{ item.descripcion }}
              </p>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-container>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { fr } from "../firebase";
import fn from "../lib/index";
import DetalleCompleto from "./DetalleCompleto";

export default {
  name: "SolicitudesFinal",
  components: {
    DetalleCompleto,
  },
  beforeDestroy() {
    this.unsuscribe();
  },
  mounted() {
    this.obtenerSolicitudes();
  },
  data() {
    return {
      titulo: "Solicitudes finalizadas",
      headers: [
        { text: "Consulta", align: "start", value: "consulta" },
        { text: "Costo", align: "start", value: "costo" },
        { text: "Fecha solicitud", align: "start", value: "fechaRegistro" },
        { text: "Fecha atención", align: "start", value: "fechaEspera" },
        { text: "Fecha comprobante", align: "start", value: "fechaVoucher" },
        { text: "Contacto", align: "start", value: "numero" },
        { text: "Responsable", align: "start", value: "terceroTxt" },
        { text: "Cliente", align: "start", value: "cliente" },
        { text: "Estatus", align: "start", value: "estatus" },
        { text: "Acciones", align: "start", value: "actions" },
      ],
      data: [],
      search: "",
      unsuscribe: null,
      consulta: null,
      items: [],
      descripcion: '',
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setTaskCompleted: "settingsModule/setTaskCompleted",
      setURLVoucher: "generalsModule/setURLVoucher",
      setVoucherDialog: "generalsModule/setVoucherDialog",
    }),
    ...mapActions({
      verDetalle: "generalsModule/verDetalle",
    }),
    verComprobante(consulta) {
      // console.log(consulta);
      this.setURLVoucher(consulta.urlVocher);
      this.setVoucherDialog(true);
    },
    fechaFormato(mil) {
      return fn.fechaFormato(mil);
    },
    obtenerSolicitudes() {
      this.setLoading(true);
      this.unsuscribe = fr
        .collection("consultas")
        .where("estatus", "in", [4,5])
        .onSnapshot((querySnap) => {
          if (!querySnap.empty) {
            let temp = [];
            querySnap.forEach((doc) => {
              temp.push({
                id: doc.id,
                ...doc.data(),
                fechaRegistro: fn.fechaFormato(doc.data().fechaRegistro),
                fechaEspera: fn.fechaFormato(doc.data().fechaEspera),
                fechaVoucher: fn.fechaFormato(doc.data().fechaVoucher),
                fechaInicioTramite: fn.fechaFormato(
                  doc.data().fechaInicioTramite
                ),
                terceroTxt: doc.data().tercero.text,
                terceroID: doc.data().tercero.id,
                cliente:
                  doc.data().usuario.nombre +
                  " " +
                  doc.data().usuario.apellidos,
              });
            });
            this.data = temp;
          } else {
            this.data = [];
          }
          this.setLoading(false);
        });
    },
    async verAvance(consulta) {
      this.setLoading(true);
      const snap = await fr.collection("avances").doc(consulta.id).get();
      console.log(snap);
      this.consulta = consulta;
      if (snap.exists) {
        console.warn(snap.data());
        this.items = snap.data().etapas;
        this.$vuetify.goTo("#TimeLineAvances", {
          duration: 300,
          offset: 0,
          easing: "easeInOutCubic",
        });
      } else {
        console.info("NO EXISTE", consulta.id);
      }
      this.setLoading(false);
      // console.log(consulta);
    },
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
  },
};
</script>