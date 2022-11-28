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
              @click="aceptar(item)"
              v-bind="attrs"
              v-on="on"
              color="secondary"
            >
              mdi-check-underline-circle
            </v-icon>
          </template>
          <span> Iniciar proceso</span>
        </v-tooltip>

        <v-tooltip bottom>
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
              @click="cancelar(item, 9)"
              v-bind="attrs"
              v-on="on"
              color="#B00020"
            >
              mdi-delete-circle-outline
            </v-icon>
          </template>
          <span> Cancelar consulta con pago</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="cancelar(item, 8)"
              v-bind="attrs"
              v-on="on"
              color="#B00020"
            >
              mdi-delete
            </v-icon>
          </template>
          <span> Cancelar consulta sin pago</span>
        </v-tooltip>
      </template>

      <!-- <template v-slot:item.estatus>
        <v-chip dark> En espera de pago </v-chip>
      </template> -->
    </v-data-table>
    

    <v-dialog v-model="aceptarDialog" max-width="400px">
      <v-card>
        <v-card-title class="title"> Validación del pago </v-card-title>
        <v-card-subtitle>
          Inicio del tramite
        </v-card-subtitle>
        <v-card-text>
          Para iniciar el tramite, debes estar seguro de que el responsable y el cliente estan deacuerdo.
          Que el cliente ha pagado el costo por el tramite, y que el comprobante es correcto y el pago ha sido corroborado.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="iniciarTramite">
            Aceptar e iniciar tramite
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DetalleCompleto></DetalleCompleto>
<!--    <CancelDialog :id="cancelacionID" :estatus="estatusCancel" ></CancelDialog>-->
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { fr } from "../firebase";
import fn from "../lib/index";
import DetalleCompleto from './DetalleCompleto';

export default {
  name: "SolicitudesPag",
  components: {
    DetalleCompleto,
  },
  mounted() {
    this.obtenerSolicitudes();
  },
  beforeDestroy() {
    this.unsuscribe();
  },
  data() {
    return {
      titulo: "Solicitudes pagadas por aprobar",
      headers: [
        { text: "Consulta", align: "start", value: "consulta" },
        { text: "Costo", align: "start", value: "costo" },
        { text: "Fecha solicitud", align: "start", value: "fechaRegistro" },
        { text: "Fecha atención", align: "start", value: "fechaEspera" },
        { text: "Fecha comprobante", align: "start", value: "fechaVoucher" },
        { text: "Contacto", align: "start", value: "numero" },
        { text: "Responsable", align: "start", value: "terceroTxt" },
        { text: "Cliente", align: "start", value: "cliente", width: 200 },
        { text: "Acciones", align: "start", value: "actions", width: 200 },
      ],
      data: [],
      search: "",
      unsuscribe: null,
      aceptarDialog: false,
      consultaTemp: {},
      cancelacionID: '',
      estatusCancel: null,
      linkPdf: null,
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setTaskCompleted: "settingsModule/setTaskCompleted",
      setDialogDetalleState : 'generalsModule/setDialogDetalleState',
      setDetalleData: 'generalsModule/setDetalleData',
      setURLVoucher: 'generalsModule/setURLVoucher',
      setVoucherDialog: 'generalsModule/setVoucherDialog',
      setCancelDialogModel: "generalsModule/setCancelDialogModel",
      setInfoCancelacion: "generalsModule/setInfoCancelacion"
    }),
    ...mapActions({
      verDetalle: 'generalsModule/verDetalle'
    }),
    obtenerSolicitudes() {
      this.unsuscribe = fr
        .collection("consultas")
        .where("estatus", "==", 2)
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
        });
    },
    aceptar(consulta) {
      this.aceptarDialog = true;
      console.log(consulta);
      const [temp] = this.data.filter( c => c.id == consulta.id);
      this.consultaTemp = temp;
    },
    verComprobante(consulta) {
      // console.log(consulta);
      this.setURLVoucher(consulta.urlVocher);
      this.setVoucherDialog(true);
    },
    cancelar(consulta, estatus){
      // this.cancelacionID = consulta.id;
      // this.estatusCancel = estatus;
      this.setInfoCancelacion({id: consulta.id, estatus });
      this.setCancelDialogModel(true);
    },
    async iniciarTramite() {
      this.setLoading(true);
      console.log(this.consultaTemp.id);
      try {
        await fr.collection('consultas').doc(this.consultaTemp.id).update({
          fechaInicioTramite: Date.now(),
          estatus: 3,
        });
        await fr.collection('consultas').doc(this.consultaTemp.id).set({
          idConsulta: this.consultaTemp.id,
        }, { merge: true }); 

        await fr
          .collection("notificaciones-app")
          .doc()
          .set({
            fechaRegistro: Date.now(),
            consulta: this.consultaTemp.consulta,
            usuarioRegistro: this.consultaTemp.usuarioRegistro,
            consultaId: this.consultaTemp.id,
            notification_label: "Se verificó el pago de la consulta, comenzó el trámite",
            estatus: 0,
          });

        await fr.collection('avances').doc(this.consultaTemp.id).set({
          etapas: [
            {
              estatus: 'Tramite iniciado',
              fecha: Date.now(),
              icon: 'mdi-clock-start',
              id: 1,
              descripcion: 'La consulta comenzó a ser trabajada...',
              linkPdf: this.linkPdf,
            }
          ],
          ultimaActualizacion: Date.now()
        });
        this.setTaskCompleted({
          message: "Tramite iniciado con exito",
          color: "success",
        });
      } catch (error) {
        this.setTaskCompleted({
          message: "Error, revisa tu conexión a internet",
          color: "error",
        });
      } finally {
        this.aceptarDialog = false;
        this.setLoading(false);
      }
    }
  },
  computed: {
    ...mapState('settingsModule', ['loading'])
  },
};
</script>