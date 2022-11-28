<template>
  <div>
    <v-dialog v-model="cancelDialogModel" persistent max-width="600">
      <v-card class="mx-auto" :loading="loading">
        <v-card-title> 
          Cancelar servicio <b v-if="estatusCancelacion == 9">pagado</b>
        </v-card-title>
        <v-card-subtitle> Describe porque quiere cancelar </v-card-subtitle>
        <v-card-text>
          <v-alert v-if="estatusCancelacion == 9" text prominent type="error" icon="mdi-alert-octagram">
            Esta consulta puedo haber sido <b>pagada</b>. Al cancelarla es posible
            que se deba hacer un reembolso.
          </v-alert>
          <v-text-field
            v-model.trim="descripcion"
            filled
            label="Motivo de cancelación"
            clearable
            persistent-hint
            hint="Escribe el motivo de cancelación"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" text @click="setCancelDialogModel(false)">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            text
            @click="cancelar"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { auth, fr } from "../firebase";
export default {
  name: "CancelDialog",
  data() {
    return {
      descripcion: "",
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      taskCompleted: "settingsModule/setTaskCompleted",
      setCancelDialogModel: "generalsModule/setCancelDialogModel",
    }),
    async cancelar() {
      console.info(this.estatus, this.descripcion, this.idConsultaCancelacion);
      try {
        if (this.descripcion != "" && this.idConsultaCancelacion) {
          this.setLoading(true);
          await fr.collection("consultas").doc(this.idConsultaCancelacion).update({
            estatus: this.estatusCancelacion,
            motivoCancelacion: this.descripcion,
            fechaCancelacion: Date.now(),
            usuarioCancelacion: auth.currentUser.uid,
          });

          this.setCancelDialogModel(false);

          this.taskCompleted({
            message: "Solicitud cancelada",
            color: "success",
          });

        }
      } catch (error) {
        console.warn(error);
        this.taskCompleted({
          message: "Revise su conexión a internet e intente de nuevo",
          color: "error",
        });
      } finally {
        this.setLoading(false);
      }
    },
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
    ...mapState("generalsModule", ["cancelDialogModel", "idConsultaCancelacion", "estatusCancelacion"]),
  },
};
</script>