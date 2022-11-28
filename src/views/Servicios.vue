<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary" class="mr-2">mdi-toolbox-outline</v-icon>
        Administración de solicitudes de servicios
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <v-divider ></v-divider>
      <v-tabs centered icons-and-text>
        <v-tab>
          <v-icon left> mdi-file-clock-outline </v-icon>
          Pendientes
        </v-tab>
        <v-tab>
          <v-icon left> mdi-credit-card-clock-outline </v-icon>
          En espera de pago
        </v-tab>
        <v-tab>
          <v-icon left> mdi-credit-card-check </v-icon>
          Validación de pago
        </v-tab>
        <v-tab>
          <v-icon left> mdi-check-circle-outline </v-icon>
          Aceptadas
        </v-tab>
        <v-tab>
          <v-icon left> mdi-file-cancel-outline </v-icon>
          Canceladas
        </v-tab>
        <v-tab>
          <v-icon left> mdi-check </v-icon>
          Finalizadas
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SolicitudesPend></SolicitudesPend>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SolicitudesEsp></SolicitudesEsp>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SolicitudesPag></SolicitudesPag>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SolicitudesAcept></SolicitudesAcept>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SolicitudesCanc></SolicitudesCanc>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SolicitudesFinal></SolicitudesFinal>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      <CancelDialog></CancelDialog>
      <VoucherDialog></VoucherDialog>
    </v-card>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import SolicitudesPend from '../components/SolicitudesPend';
import SolicitudesEsp from '../components/SolicitudesEsp';
import SolicitudesPag from '../components/SolicitudesPag';
import SolicitudesAcept from '../components/SolicitudesAcept';
import SolicitudesCanc from '../components/SolcitudesCanc';
import SolicitudesFinal from '../components/SolicitudesFinal';
import CancelDialog from "../components/CancelDialog";
import VoucherDialog from "../components/VoucherDialog";

export default {
  name: "Servicios",
  components: {
    SolicitudesPend,
    SolicitudesEsp,
    SolicitudesPag,
    SolicitudesAcept,
    SolicitudesCanc,
    SolicitudesFinal,
    CancelDialog,
    VoucherDialog
  },
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Solicitudes de Servicios", disabled: false, to: "servicios" },
    ]);
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setBreadInit: "settingsModule/setBreadInit",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),
  },
};
</script>