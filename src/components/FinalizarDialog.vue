<template>
  <div>
    <v-dialog v-model="finalizarDialogBand" persistent max-width="600">
      <v-card class="mx-auto" :loading="loading">
        <v-card-title> Servicio terminado </v-card-title>
        <v-card-subtitle>
          Describe como se finalizo el proceso
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col>
              <v-radio-group v-model="estatus" row>
                <v-radio label="Termino satifactoriamente" :value="4"></v-radio>
                <v-radio label="Termino sin exito" :value="5"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <transition name="fade" mode="out-in">
            <v-alert
              v-if="estatus == 5"
              text
              prominent
              type="error"
              icon="mdi-alert-octagram"
            >
              Se debera comunicar con el cliente, para gestionar un posible
              reembolso.
            </v-alert>
          </transition>
          <v-text-field
            v-model.trim="descripcion"
            filled
            label="Observaciones"
            clearable
            persistent-hint
            hint="Es altamente recomendable escribir observaciones si fallo la consultoria"
          ></v-text-field>
          <v-text-field
            v-model.trim="linkPdf"
            filled
            label="Link al PDF"
            clearable
            persistent-hint
            hint="Si existe un archivo asociado a esta actualización. Insertar el link aquí"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" text @click="setDialog(false)"> Cancelar </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            text
            @click="finalizar"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { fr, firebase } from "../firebase";
export default {
  name: "FinalizarDialog",
  props: {
    id: String,
    consultaUserId: String,
    consultaLabel: String,


  },
  data() {
    return {
      estatus: 4,
      descripcion: "Todo se realizo correctamente.",
      linkPdf: "",
    };
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setDialog: "generalsModule/setFinalizarDialog",
      setLoading: "settingsModule/setLoading",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),
    async finalizar() {
      console.log(this.id, this.estatus, this.descripcion);
      try {
        this.setLoading(true);
        await fr.collection("consultas").doc(this.id).update({
          estatus: this.estatus,
          fechaFinalizado: Date.now(),
          descripcionFinalizado: this.descripcion,
        });
        await fr
          .collection("avances")
          .doc(this.id)
          .update({
            etapas: firebase.firestore.FieldValue.arrayUnion({
              fecha: Date.now(),
              id: 5,
              estatus: "Tramite finalizado",
              icon: "mdi-check",
              descripcion: "Tramite finalizado",
              linkPdf: this.linkPdf,
            }),
            ultimaActualizacion: Date.now(),
          });
        await fr
          .collection("notificaciones-app")
          .doc()
          .set({
            fechaRegistro: Date.now(),
            consulta: this.consultaLabel,
            usuarioRegistro: this.consultaUserId ,
            notification_label: "¡Se finalizó el proceso!",
            consulataId: this.id,
            estatus: 0,
          });
        this.setTaskCompleted({
          message: "Consultoria finalizada",
          color: "success",
        });
        this.descripcion = "";
        this.setDialog(false);
      } catch (error) {
        console.warn(error);
        this.setTaskCompleted({
          message: "Error, revisa tu conexión a internet",
          color: "error",
        });
      } finally {
        this.setLoading(false);
      }
    },
  },
  computed: {
    ...mapState("generalsModule", ["finalizarDialogBand"]),
    ...mapState("settingsModule", ["loading"]),
  },
  watch: {
    estatus: function (val) {
      console.log(val);
      if (val == 5) {
        this.descripcion = null;
      }
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>