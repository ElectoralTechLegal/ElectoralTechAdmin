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
      <template v-slot:[`item.estatus`]="{ item }">
        <v-chip color="secondary" label text-color="white">
          {{ estatus(item) }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom v-if="item.estatus == 2 || item.estatus == 3|| item.estatus == 4">
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
        <v-tooltip bottom v-if="item.estatus == 3 || item.estatus == 4">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="setEstatus(item, 2)"
              v-bind="attrs"
              v-on="on"
              color="secondary"
            >
              mdi-close-box-outline
            </v-icon>
          </template>
          <span> Cancelar descarga </span>
        </v-tooltip>
        <v-tooltip bottom v-if="item.estatus == 2">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="setEstatus(item, 3)"
              v-bind="attrs"
              v-on="on"
              color="secondary"
            >
              mdi-file-check-outline
            </v-icon>
          </template>
          <span> Aceptar pago</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <VoucherDialog></VoucherDialog>
    <v-dialog v-model="aceptarDialog" max-width="400px">
      <v-card :loading="cargando">
        <v-card-title class="title"> Validación del pago </v-card-title>
        <v-card-subtitle> Acceso a descarga del formato </v-card-subtitle>
        <v-card-text>
          <v-alert
            v-if="error"
            text
            prominent
            type="error"
            icon="mdi-alert-octagram"
          >
            Error de conexión !
          </v-alert>
          ¿Conceder acceso a la descarga del formato {{ formatoTemp.formato }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue  darken-1" @click="darAcceso" :loading="cargando">
            {{ cargando ? "Cargando" : "Aceptar" }}
          </v-btn>
          <v-btn text @click="cancelar" v-if="!cargando"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { fr } from "../firebase";
import fn from "../lib/index";
import VoucherDialog from "./VoucherDialog";
export default {
  name: "FormatoPago",
  components: {
    VoucherDialog,
  },
  mounted() {
    this.getFormatos();
  },
  beforeDestroy() {
    this.unsuscribe();
  },
  data() {
    return {
      search: "",
      titulo: "Formatos de pago generados", 
      headers: [
        { text: "Nombre", align: "start", value: "nombre" },
        { text: "Teléfono", align: "start", value: "telefono" },
        { text: "Correo", align: "start", value: "correo" },
        { text: "Estado", align: "start", value: "estado" },
        { text: "Fecha registro", align: "start", value: "fecha_registro" },
        { text: "Formato", align: "start", value: "formato" },
        { text: "Costo", align: "start", value: "costo" },
        { text: "Estatus", align: "start", value: "estatus" },
        { text: "Aciones", align: "start", value: "actions" },
      ],
      data1: [],
      data2: [],
      data: [],
      dataTwo: [],
      unsuscribe: null,
      aceptarDialog: false,
      formatoTemp: {},
      cargando: false,
      error: false,
      nuevoEstatus: 0,
    };
  },

  methods: {
    ...mapMutations("generalsModule", ["setURLVoucher", "setVoucherDialog"]),
    async getFormatos() {
      try {
        this.unsuscribe = fr
          .collection("formatosGeneral")
          .where("tipoFormato", "in", [4,5,6,8,9,10,11,12,13,14])
          .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
              let docs = [];
              querySnapshot.forEach((doc) => {
                const fechaFormat = fn.fechaFormato(doc.data().fechaRegistro);
                const { usuarioInfo } = doc.data();
                const { estado } = usuarioInfo;
                docs.push({
                  uid: doc.id,
                  ...usuarioInfo,
                  estado: estado.estado,
                  fecha_registro: fechaFormat,
                  formato: doc.data().nombreFormato,
                  estatus: doc.data().estatus,
                  costo: "$" + doc.data().costo,
                  urlVocher: doc.data().urlVocher,
                  fechaDescarga: doc.data().fechaDescarga
                });
              });
              this.data1 = docs;
            } else {
              console.warn("Formatos free empty");
            }
          });

          fr
          .collection("formatosGeneral")
          .where("tipoFormato", "in", [15,16])
          .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
              let docs = [];
              querySnapshot.forEach((doc) => {
                const fechaFormat = fn.fechaFormato(doc.data().fechaRegistro);
                const { usuarioInfo } = doc.data();
                const { estado } = usuarioInfo;
                docs.push({
                  uid: doc.id,
                  ...usuarioInfo,
                  estado: estado.estado,
                  fecha_registro: fechaFormat,
                  formato: doc.data().nombreFormato,
                  estatus: doc.data().estatus,
                  costo: "$" + doc.data().costo,
                  urlVocher: doc.data().urlVocher,
                  fechaDescarga: doc.data().fechaDescarga
                });
              });
              this.data2 = docs;
              this.data = this.data1.concat(this.data2);
            } else {
              console.warn("Formatos free empty");
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    estatus(formato) {
      switch (formato.estatus) {
        case 1:
          return "En espera de pago";
        case 2:
          return "Validación del voucher";
        case 3:
          return "Formato descargable";
        case 4:
          return "Formato descargado el " + fn.fechaFormato(formato.fechaDescarga);
      }
    },
    verComprobante(consulta) {
      console.log(consulta);
      this.setURLVoucher(consulta.urlVocher);
      this.setVoucherDialog(true);
    },
    setEstatus(consulta, estatus) {
      this.nuevoEstatus = estatus;
      this.formatoTemp = consulta;
      this.aceptarDialog = true;
      console.log(consulta);
    },
    cancelar() {
      this.aceptarDialog = false;
      this.error = false;
    },
    async darAcceso() {
      // this.formatoTemp.uid;
      try {
        this.error = false;
        this.cargando = true;
        await fr
          .collection("formatosGeneral")
          .doc(this.formatoTemp.uid)
          .update({
            estatus: this.nuevoEstatus,
            fechaAccesoDescarga: Date.now(),
          });
        this.aceptarDialog = false;
      } catch (error) {
        this.error = true;
        console.warn(error);
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>
<style>
</style>