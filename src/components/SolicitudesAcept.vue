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
            <v-list-item @click="verDialog(item)">
              <v-list-item-icon>
                <v-icon>mdi-update</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Actualizar avance </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="finalizarConsultoria(item)">
              <v-list-item-icon>
                <v-icon>mdi-check</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Finalizar consultoria </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

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
\
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

            <v-list-item @click="cancelar(item)">
              <v-list-item-icon>
                <v-icon>
                  mdi-delete-circle-outline
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Cancelar consultoria </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- <template v-slot:item.estatus>
        <v-chip dark> En espera de pago </v-chip>
      </template> -->
    </v-data-table>

    <DetalleCompleto></DetalleCompleto>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Actualizar avance
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-select
                v-model="avanceSelect"
                :items="estatus"
                label="Selecciona un estatus"
                prepend-icon="mdi-format-list-checks"
                filled
                hint="Selecciona uno de los estatus"
                item-text="text"
                item-value="id"
                return-object
                persistent-hint
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field
            v-model.trim="linkPdf"
            filled
            label="Link al PDF"
            clearable
            persistent-hint
            hint="Si existe un archivo asociado a esta actualización. Insertar el link aquí"
          ></v-text-field>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea filled v-model="descripcion" label="Agrega una descripción"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="loading" text @click="actualizar">
            Actualizar estado
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-divider id="TimeLineAvances"></v-divider>

    <v-container v-if="consulta && timelineBand">
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
<!--    <CancelDialog :id="idConsulta" :estatus=9 ></CancelDialog>-->
    <FinalizarDialog :id="idConsulta" :consultaUserId="consultaUserId" :consultaLabel="consultaLabel" ></FinalizarDialog>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { fr, firebase } from "../firebase";
import fn from "../lib/index";
import DetalleCompleto from "./DetalleCompleto";
import FinalizarDialog from './FinalizarDialog';

export default {
  name: "SolicitudesAcept",
  components: {
    DetalleCompleto,
    FinalizarDialog
  },
  beforeDestroy() {
    this.unsuscribe();
  },
  mounted() {
    this.obtenerSolicitudes();
    this.obtenerEstatus();
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
        { text: "Cliente", align: "start", value: "cliente" },
        { text: "Acciones", align: "start", value: "actions" },
      ],
      data: [],
      search: "",
      unsuscribe: null,
      consulta: null,
      items: [],
      dialog: false,
      avanceSelect: null,
      estatus: [],
      descripcion: '',
      idConsulta: '',
      timelineBand: false,
      linkPdf: "",
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setTaskCompleted: "settingsModule/setTaskCompleted",
      setURLVoucher: "generalsModule/setURLVoucher",
      setVoucherDialog: "generalsModule/setVoucherDialog",
      setCancelDialogModel: "generalsModule/setCancelDialogModel",
      setDialog: 'generalsModule/setFinalizarDialog',
      setInfoCancelacion: "generalsModule/setInfoCancelacion"
    }),
    ...mapActions({
      verDetalle: "generalsModule/verDetalle",
    }),
    verDialog(item) {
      this.timelineBand = true;
      this.idConsulta = item.id;
      this.consulta = item;
      this.dialog= true;
      this.consultaUserId = item.usuarioRegistro;
      this.consultaLabel = item.consulta;
      
    },
    async actualizar() {
      try {
        if (this.idConsulta != "" && this.avanceSelect != null && this.descripcion != '') {
          console.log('actualizando')
          this.setLoading(true);
          await fr.collection("avances").doc(this.idConsulta).update({
            etapas: firebase.firestore.FieldValue.arrayUnion({
              fecha: Date.now(),
              id: this.avanceSelect.id,
              estatus: this.avanceSelect.text,
              icon: this.avanceSelect.icon,
              descripcion: this.descripcion,
              linkPdf: this.linkPdf,
            }),
            ultimaActualizacion: Date.now()
          });
          await fr
            .collection("notificaciones-app")
            .doc()
            .set({
              fechaRegistro: Date.now(),
              consulta: this.consultaLabel,
              usuarioRegistro: this.consultaUserId ,
              consultaId: this.idConsulta,
              notification_label: "Nueva actualización de avance",
              estatus: 0,
            });
          this.verAvance(this.consulta);
          this.dialog= false;
          this.avanceSelect = null;
          this.descripcion = "";
          this.linkPdf= "";
          // this.setLoading(false);
        } else {
          this.setTaskCompleted({
            message: "Seleccciona un estatus y escribe una descripción",
            color: "error",
          });
        }
      } catch (error) {
        console.log(error)
        this.setTaskCompleted({
          message: "Error, revisa tu conexión a internet",
          color: "error",
        });
      }
    },
    verComprobante(consulta) {
      // console.log(consulta);
      this.setURLVoucher(consulta.urlVocher);
      this.setVoucherDialog(true);
      this.timelineBand = true;
    },
    fechaFormato(mil) {
      return fn.fechaFormato(mil);
    },
    async obtenerEstatus() {
      try {
        const snap = await fr.collection('estatusAvance').get();
        if ( !snap.empty ) {
          this.estatus = snap.docs[0].data().estatus;
          console.log(this.estatus)
        }
      } catch (error) {
        console.warn('Error en carga de estatus', error);
      }
    },
    obtenerSolicitudes() {
      this.setLoading(true);
      this.unsuscribe = fr
        .collection("consultas")
        .where("estatus", "==", 3)
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
        this.timelineBand = true;
      } else {
        console.info("NO EXISTE", consulta.id);
      }
      this.setLoading(false);
      // console.log(consulta);
    },
    finalizarConsultoria(consulta) {
      this.idConsulta = consulta.id;
      this.timelineBand = false;
      this.consultaUserId = consulta.usuarioRegistro;
      this.consultaLabel = consulta.consulta;
      this.setDialog(true);
    },
    cancelar(consulta) {
      // this.idConsulta = consulta.id;
      this.timelineBand = false;
      console.log(consulta);
      this.setInfoCancelacion({id: consulta.id, estatus: 9});
      this.setCancelDialogModel(true);
    }
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
  },
};
</script>