<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary"  class="mr-2"> mdi-account-cog</v-icon>
        Administración de las solicitudes de acceso al marketplace
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text>
        <CustomTable
              :headers="headers"
              :data="elementos"
              :search="search"
              titulo="Solicitudes para unirse al Marketplace"
            ></CustomTable>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import CustomTable from "../components/CustomTable";
import fn from "../lib/index";
import {fr} from '../firebase';
export default {
  name: "ContactoMarket",
  components:{
    CustomTable
  },
  mounted(){
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Solicitudes de acceso al MarketPlace", disabled: false, to: "accesoMarket" },
    ]);
    this.getSolicitudes();
  },
  beforeDestroy(){
    this.unsuscribe();
  },
  data() {
    return {
      search: "",
      headers:[
        { text: "Nombre", align: "start", value: "nombre" },
        { text: "Empresa", align: "start", value: "nombreEmpresa" },
        { text: "Web", align: "start", value: "sitio" },
        { text: "Correo", align: "start", value: "email" },
        { text: "Tamaño Firma", align: "start", value: "tamFirma" },
        { text: "Registro", align: "start", value: "fechaFormat" },
      ],
      elementos: [],
      unsuscribe: null,
    };
  },
  computed: {
    ...mapState('settingsModule', ['loading'])
  },
  methods:{
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setBreadInit: "settingsModule/setBreadInit",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),
    async getSolicitudes() {
      try {
        this.setLoading(true);
        this.unsuscribe = fr.collection("registroMarketPlace").onSnapshot( (querySnapshot) => {
          this.setLoading(false);
          if (!querySnapshot.empty) {
            let docs = [];
              querySnapshot.forEach((doc) => {
                const fechaFormat = fn.fechaFormato(doc.data().fechaRegistro);
                docs.push({
                  ...doc.data(),
                  tamFirma: doc.data().tamFirma == '1' ? "2 - 4 abogados" : doc.data().tamFirma == "2" ? "Entre 5-9 abogados" : "Más de 10",
                  fechaFormat
                });
              });
              this.elementos = docs;
            } else {
              console.warn('Formatos free empty')
            }
        })
      } catch (error) {
        this.setTaskCompleted({
            message: "Error de conexión",
            color: "error",
          });
        console.error(error);
      }
    },
  }
};
</script>