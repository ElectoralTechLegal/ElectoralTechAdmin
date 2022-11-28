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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="cancelar(item)"
              v-bind="attrs"
              v-on="on"
              color="#B00020"
            >
              mdi-delete
            </v-icon>
          </template>
          <span> Cancelar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <DetalleCompleto></DetalleCompleto>
<!--    <CancelDialog :id="cancelacionID" :estatus=8 ></CancelDialog>-->
  </div>
</template>
<script>
import { fr } from "../firebase";
import lib from "../lib/index";
import {mapActions, mapMutations} from 'vuex';
import DetalleCompleto from './DetalleCompleto';

export default {
  name: "SolicitudesPend",
  components: {
    DetalleCompleto,
  },
  mounted() {
    console.log("init solitudes esp");
    this.obtenerSolicitudes();
  },
  beforeDestroy() {
    this.unsuscribe()
  },
  data() {
    return {
      search: "",
      titulo: "Solicitudes en espera",
      headers: [
        { text: "Consulta", align: "start", value: "consulta" },
        { text: "Costo", align: "start", value: "costo" },
        { text: "Fecha registro", align: "start", value: "fechaRegistro" },
        { text: "Fecha atención", align: "start", value: "fechaEspera" },
        { text: "Teléfono", align: "start", value: "numero" },
        { text: "Responsable", align: "start", value: "tercero" },
        // { text: "Estatus", align: "start", value: "estatus" },
        { text: "Acciones", align: "start", value: "actions" },
      ],
      data: [],
      unsuscribe: null,
      cancelacionID: '',
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setDialogDetalleState : 'generalsModule/setDialogDetalleState',
      setDetalleData: 'generalsModule/setDetalleData',
      setCancelDialogModel: "generalsModule/setCancelDialogModel",
      setInfoCancelacion: "generalsModule/setInfoCancelacion"
    }),
    ...mapActions({
      verDetalle: 'generalsModule/verDetalle'
    }),
    cancelar(consulta) {
      // this.cancelacionID = consulta.id;
      this.setInfoCancelacion({id: consulta.id, estatus:8 });
      this.setCancelDialogModel(true);
    },
    obtenerSolicitudes() {
      this.unsuscribe = fr.collection("consultas")
        .where("estatus", "==", 1)
        .onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            let temp = [];
            snapshot.forEach((doc) => {
              temp.push({
                id: doc.id,
                ...doc.data(),
                fechaRegistro: lib.fechaFormato(doc.data().fechaRegistro),
                fechaEspera: lib.fechaFormato(doc.data().fechaEspera),
                terceroID: doc.data().tercero.id,
                tercero: doc.data().tercero.text,
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
};
</script>