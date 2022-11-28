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
    <v-data-table
      :headers="headers"
      :items="data"
      :search="search"
      :calculate-widths="true"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="verDetalle(item)"
              v-bind="attrs"
              v-on="on"
              color="accent"
            >
              mdi-account-details
            </v-icon>
          </template>
          <span> Ver detalle</span>
        </v-tooltip>
        <v-tooltip bottom v-if="item.estatus != 8">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="verComprobante(item)"
              v-bind="attrs"
              v-on="on"
              color="accent"
            >
              mdi-ticket-percent-outline
            </v-icon>
          </template>
          <span> Ver comprobante</span>
        </v-tooltip>

        <v-tooltip bottom v-if="item.estatus == 6 || item.estatus == 10">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="verCancelacion(item)"
              v-bind="attrs"
              v-on="on"
            >
              mdi-format-list-text
            </v-icon>
          </template>
          <span> Ver cancelación </span>
        </v-tooltip>

        <v-tooltip bottom v-if="item.estatus == 6">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              color="warning"
              @click="realizarReembolso(item)"
              v-bind="attrs"
              v-on="on"
            >
              mdi-cog-transfer-outline
            </v-icon>
          </template>
          <span> Cancelar servicio </span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.estatus`]="{ item }">
        <v-chip :color="setColor(item.estatus)" label text-color="white">
          <v-avatar left>
            <v-icon>mdi-file-cancel</v-icon>
          </v-avatar>
          {{ estatus(item) }}
        </v-chip>
      </template>
    </v-data-table>
    <DetalleCompleto></DetalleCompleto>
    <DetalleCancel :consulta="consulta" v-if="consulta"></DetalleCancel>
    <AceptCancelDialog :id="id"></AceptCancelDialog>
  </div>
</template>
<script>
import DetalleCompleto from "./DetalleCompleto";
import DetalleCancel from "./DetalleCancel";
import AceptCancelDialog from "./AceptCancelDialog";

import { fr } from "../firebase";
import { mapActions, mapMutations } from "vuex";
import lib from "../lib/index";

export default {
  name: "SolicitudesCanc",
  components: {
    DetalleCompleto,
    AceptCancelDialog,
    DetalleCancel,
  },
  data() {
    return {
      search: "",
      titulo: "Solicitudes canceladas",
      headers: [
        { text: "Consulta", align: "start", value: "consulta" },
        {
          text: "Motivo",
          align: "start",
          value: "motivoCancelacion",
          width: 200,
        },
        { text: "Costo", align: "start", value: "costo" },
        { text: "Fecha registro", align: "start", value: "fechaRegistro" },
        { text: "Fecha atención", align: "start", value: "fechaEspera" },
        {
          text: "Fecha cancelación",
          align: "start",
          value: "fechaCancelacion",
        },
        { text: "Responsable", align: "start", value: "tercero" },
        { text: "Estatus", align: "start", value: "estatus" },
        { text: "Acciones", align: "start", value: "actions" },
      ],
      data: [],
      unsuscribe: null,
      consulta: null,
      id: "",
    };
  },
  mounted() {
    this.obtenerSolicitudes();
  },
  beforeDestroy() {
    if (this.unsuscribe) {
      this.unsuscribe();
    }
  },
  methods: {
    ...mapMutations({
      setCancelDialogDet: "generalsModule/setCancelDialogDet",
      setAceptCancelDialog: "generalsModule/setAceptCancelDialog",
      setURLVoucher: 'generalsModule/setURLVoucher',
      setVoucherDialog: 'generalsModule/setVoucherDialog',
    }),
    ...mapActions({
      verDetalle: "generalsModule/verDetalle",
    }),
    verComprobante(consulta) {
      // console.log(consulta);
      this.setURLVoucher(consulta.urlVocher);
      this.setVoucherDialog(true);
    },
    verCancelacion(item) {
      this.consulta = item;
      this.setCancelDialogDet(true);
    },
    setColor(est) {
      //
      switch (est) {
        case 6:
          return "error";
        case 7:
          return "accent";
        case 8:
          return "accent";
        case 9:
          return "error";
        case 10:
          return "success";
      }
    },
    estatus(item) {
      let estatus = '';
      switch (item.estatus) {
        case 6:
          estatus = "Solicitud de cancelación con pago";
          break;
        case 7:
          estatus = "Solicitud de cancelación sin pago";
          break;
        case 8:
          estatus = "Cancelado por admin";
          break;
        case 9:
          estatus = "Cancelado por admin con pago";
          break;
        case 10:
          estatus = "Solicitud de cancelación aprovada";
          estatus += item.reembolso ? ' - con reembolso ' : '- sin reembolso';
          break;
      }
      return estatus;
    },
    async realizarReembolso(item) {
      console.log(item);
      this.id = item.id;
      this.setAceptCancelDialog(true);
    },
    obtenerSolicitudes() {
      this.unsuscribe = fr
        .collection("consultas")
        .where("estatus", "in", [6, 7, 8, 9, 10])
        .onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            let temp = [];
            snapshot.forEach((doc) => {
              temp.push({
                id: doc.id,
                ...doc.data(),
                costo: doc.data().costo ? doc.data().costo : "-",
                fechaRegistro: lib.fechaFormato(doc.data().fechaRegistro),
                fechaCancelacion: lib.fechaFormato(doc.data().fechaCancelacion),
                fechaEspera: doc.data().fechaEspera
                  ? lib.fechaFormato(doc.data().fechaEspera)
                  : "-",
                terceroID: doc.data().tercero ? doc.data().tercero.id : "-",
                tercero: doc.data().tercero ? doc.data().tercero.text : "-",
              });
            });

            this.data = temp;
          } else {
            this.data = [];
            console.info("empty");
          }
        });
    },
  },
  computed: {},
};
</script>