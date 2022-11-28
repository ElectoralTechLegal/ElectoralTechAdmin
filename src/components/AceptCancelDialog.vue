<template>
  <div class="text-center">
    <v-dialog v-model="aceptCancelBand" width="600">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Gestionar cancelación
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-alert text prominent type="error" icon="mdi-alert-box">
                <b>Revisa el detalle de cancelación</b> y valora en conjunto con
                el <b>responsable de la consultoria</b> las razones de
                cancelación para tomar acciones para un
                <b>posible</b> reembolso.
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                outlined
                name="respuestaCancelacion"
                label="Escribe la respuesta a la cancelación por parte del usuario"
                v-model="respuestaCancelacion"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <v-switch
                v-model="reembolso"
                label="Aplica reembolso"
                color="indigo"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            :disabled="loading"
            text
            @click="() => setAceptCancelDialog(false)"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            text
            @click="guardarCancelacion"
          >
            Realizar cancelación
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { fr } from "../firebase";
export default {
  name: "AceptCancelDialog",
  props: {
    id: String,
  },
  data() {
    return {
      respuestaCancelacion: "",
      reembolso: false,
      loading: false,
    };
  },
  methods: {
    ...mapMutations({
      setAceptCancelDialog: "generalsModule/setAceptCancelDialog",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),
    async guardarCancelacion() {
      try {
        await fr.collection("consultas").doc(this.id).update({
          respuestaCancelacion: this.respuestaCancelacion,
          reembolso: this.reembolso,
          estatus: 10,
        });
        this.respuestaCancelacion = '';
        this.reembolso = false;
        this.setAceptCancelDialog(false);
        this.setTaskCompleted({
          message: "Cancelación realizada",
          color: "success",
        });
      } catch (error) {
        console.warn(error);
        this.setTaskCompleted({
          message: "Revisa tu conexión a internet e intenta de nuevo",
          color: "error",
        });
      }
    },
  },
  computed: {
    ...mapState("generalsModule", ["aceptCancelBand"]),
  },
};
</script>