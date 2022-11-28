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
      class="elevation-1"
      :headers="headers"
      :items="data"
      :search="search"
      :loading="loading"
    >
      <!-- <template v-slot:item.estatus>
        <v-chip dark> Pendiente </v-chip>
      </template> -->

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="verUserRequest(item)"
              v-bind="attrs"
              v-on="on"
              color="accent"
            >
              mdi-comment-account-outline
            </v-icon>
          </template>
          <span> Ver info usuario</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              @click="asignar(item)"
              v-bind="attrs"
              v-on="on"
              color="primary"
            >
              mdi-account-search-outline
            </v-icon>
          </template>
          <span> Asignar </span>
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
    <UserInfoDialog></UserInfoDialog>
<!--    <CancelDialog :id="cancelacionID" :estatus=8 ></CancelDialog>-->
    <v-dialog v-model="asignarDialog" persistent max-width="350">
      <v-card max-width="375" class="mx-auto" :loading="loadingConsulta">
        <v-img :src="`${require('@/assets/perfil.jpg')}`" height="300px" dark>
          <v-row class="fill-height" align-content="center">
            <v-card-title class="white--text pt-12">
              <div class="title ml-5">Asignar a un tercero</div>
            </v-card-title>
          </v-row>
        </v-img>
        <v-card-text>
          <p class="mt-2">
            Selecciona el tercero que se hara responsable de llevar a cabo el
            caso.
          </p>
          <v-select
            :items="terceros"
            v-model="terceroSelect"
            item-text="text"
            item-value="id"
            return-object
            persistent-hint
            filled
            label="Selecciona"
            hint="Terceros registrados disponibles"
          ></v-select>
          <v-text-field
            v-model.trim.number="costo"
            filled
            label="Costo"
            clearable
            type="number"
            persistent-hint
            hint="Costo acordado entre el tercero y el usuario"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :loading="loadingConsulta"
            :disabled="loadingConsulta"
            text
            @click="guardarAsignacion"
          >
            Aceptar
          </v-btn>
          <v-btn color="gray" text @click="asignarDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { fr } from "../firebase";
import lib from "../lib/index";
import { mapMutations } from "vuex";
import UserInfoDialog from "../components/UserInfoDialog";

export default {
  name: "SolicitudesPend",
  components: {
    UserInfoDialog,
  },
  mounted() {
    console.log("init solitudes");
    this.solicitudesPendientes();
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  data() {
    return {
      search: "",
      titulo: "Solicitudes por revisar",
      headers: [
        { text: "Consulta", align: "start", value: "consulta" },
        { text: "Fecha registro", align: "start", value: "fechaRegistro" },
        { text: "Télefono", align: "start", value: "numero" },
        // { text: "Estatus", align: "start", value: "estatus" },
        { text: "Acciones", align: "start", value: "actions" },
      ],
      data: [],
      loading: false,
      usuarioConsulta: {},
      asignarDialog: false,
      terceros: [],
      terceroSelect: {},
      costo: "",
      solicitudSeleccionada: null,
      loadingConsulta: false,
      unsubscribe: null,
      selectedUserId: null,
      // cancelacionID: ''
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setTaskCompleted: "settingsModule/setTaskCompleted",
      setDialog: "generalsModule/setDialogState",
      setUsuarioConsulta: "generalsModule/setUsuarioConsulta",
      setCancelDialogModel: "generalsModule/setCancelDialogModel",
      setInfoCancelacion: "generalsModule/setInfoCancelacion",
    }),
    async solicitudesPendientes() {
      // const refConsultas = fr.collection("consultas");
      try {
        this.unsubscribe = fr
          .collection("consultas")
          .where("estatus", "==", 0)
          .onSnapshot((snapshot) => {
            if (!snapshot.empty) {
              let temp = [];
              snapshot.forEach((doc) => {
                temp.push({
                  id: doc.id,
                  ...doc.data(),
                  fechaRegistro: this.fechaFormato(doc.data().fechaRegistro),
                });
              });
              this.data = temp;
            } else {
              this.data = [];
            }
          });
      } catch (error) {
        console.warn(error);
      }
    },
    fechaFormato(mil) {
      return lib.fechaFormato(mil);
    },
    async verUserRequest(consulta) {
      console.log(consulta);
      this.loading = true;
      try {
        const snapshot = await fr
          .collection("usuarios")
          .doc(consulta.usuarioRegistro)
          .get();
        if (!snapshot.empty) {
          this.setUsuarioConsulta(snapshot.data());
          this.setDialog(true);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        this.loading = false;
      }
    },
    async asignar(consulta) {
      console.log(consulta);
      this.solicitudSeleccionada = consulta;
      this.loading = true;
      this.selectedConsuta = consulta;
      try {
        const snapshot = await fr
          .collection("terceros")
          .where("estatus", "==", 0)
          .get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            console.info(doc.id);
            temp.push({
              id: doc.id,
              text: doc.data().nombre,
            });
          });
          this.terceros = temp;
        }
        console.log(snapshot);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        this.asignarDialog = true;
      }
    },
    async guardarAsignacion() {
      try {
        this.loadingConsulta = true;
        this.loading = true;
        if (this.terceroSelect != {} && this.costo != "" && this.costo > 0) {
          const data = {
            tercero: this.terceroSelect,
            costo: this.costo,
            fechaEspera: Date.now(),
            estatus: 1,
          };
          await fr
            .collection("consultas")
            .doc(this.solicitudSeleccionada.id)
            .update(data);
          this.setTaskCompleted({
            message: "Consulta en espera de pago",
            color: "success",
          });
          await fr
            .collection("notificaciones-app")
            .doc()
            .set({
              fechaRegistro: Date.now(),
              consulta: this.selectedConsuta.consulta,
              usuarioRegistro: this.selectedConsuta.usuarioRegistro,
              notification_label: "Se asignó al responsable del caso, consulta en espera de pago",
              estatus: 0,
            });
        } else {
          this.setTaskCompleted({
            message: "Error, completa todos los campos",
            color: "error",
          });
        }
      } catch (error) {
        console.warn(error);
      } finally {
        this.loadingConsulta = false;
        this.asignarDialog = false;
        this.selectedConsuta = null;
        this.loading = false;
      }
    },
    cancelar(consulta) {
      // this.cancelacionID = consulta.id;
      this.setCancelDialogModel(true);
      this.setInfoCancelacion({id: consulta.id, estatus: 8});
    },
  },
};
</script>