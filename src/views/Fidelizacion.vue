<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary" class="mr-2"> mdi-alarm-panel </v-icon>
        Relación De Correos Adquiridos
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <template>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="data"
          :single-select="singleSelect"
          item-key="id"
          show-select
          class="elevation-1"
        >
          <template v-slot:top>
            <v-switch
              v-model="singleSelect"
              label="Seleccionar Solo 1"
              class="pa-3"
            ></v-switch>
          </template>
        </v-data-table>
      </template>   
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
        color="success"
        @click="mailSelect()"
        >
          ENVIAR CORREO A LOS SELECCIONADOS
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="dialogMail"
      persistent
    >
      <v-card
      :loading="loading">
        <v-toolbar
            color="yellow"
          >
          <b>ENVIAR CORREOS</b>
          <v-spacer></v-spacer>
          <v-btn
              text
              @click="clearMail()"
            >
            <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="mt-10" >
                <v-select
                  :items="mailItems"
                  value=""
                  item-key="name"
                  label="Correo a Enviar"
                  item-text="text"
                  item-value="value"
                  v-model="correoSelected"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="correoSelected == 0">
                <v-file-input
                placeholder="Archivo Adjunto"
                chips
                outlined
                prefix="Opcional:"
                v-model="fileForMail"
                >
                </v-file-input>
              </v-col>
              <v-col cols="12" v-if="correoSelected == 1">
                <v-file-input
                placeholder="Imagen Semanal"
                chips
                outlined
                prefix="Requerida:"
                v-model="imgForMail"
                accept="image/*"
                @input="$v.imageTempURL.$touch()"
                >
                </v-file-input>
                <v-text-field
                placeholder="URL del Boletin"
                outlined
                v-model="urlForMail"
                >
                  

                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn
            text
            color="green"
            :loading="loading"
            @click="sendMail()"
            >
              ENVIAR CORREOS
            </v-btn>
          </v-card-actions>
      </v-card>
      

    </v-dialog>


  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { required } from "vuelidate/lib/validators";
import { fr, storage } from "../firebase.js";
import fn from '../lib/index';
import { v4 as uuidv4 } from "uuid";

export default {
  name: "Fidelizacion",
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Fidelizacion", disabled: false, to: "fidelizacion" },
    ]);
    this.obtenerPosts();
  },
  data() {
    return {
      singleSelect: false,
      files: [],
      dialogMail: false,
      mailItems: [
        {value: 0, text: "Bienvenida"},
        {value: 1, text: "Boletin Semanal"},
      ],
      correoSelected: "",
      imgForMail: [],


      selected: [],
      imageTempURL: "",
      imgExtension: "",
      urlForMail: "",

      fileTempURL: "",
      fileExtencion: "",
      pdfTempURL: " ",
      titulo: "",
      descripcion: "",
      contenido: "",
      categoriaSelected: [],
      dialogData: false,
      userDialogInfo: {
        solicitudEstado: 0,
        datosFacturacion: { 
          nombre: "",
          rfc: "",
          codigoPostal: "",
          estado: "",
          colonia: "",
          calle: "",
          noExterior: "",
          correoFactura: "",
          Teléfono: "",
        },
        monto:"",
      },
      fileForMail: [],
      search: "",
      headers: [
        { text: "CORREO", value: "data.correo", align: 'left', sortable: false,},
        { text: "FECHA DE ADQUISICIÓN", align: "start", value: "fechaRegistro" },
      ],
      data: [],
      cambioStatus: false,
    };
  },
  validations: {
    imageTempURL: { required },
    pdfTempURL: { required },
    titulo: { required },
    descripcion: { required },
    contenido: { required },
    categoriaSelected: { required },
    prime: { required },
  },
  methods: {

    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setBreadInit: "settingsModule/setBreadInit",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),

    mailSelect(){
      this.dialogMail = true;
    },

    async obtenerPosts() {
      try {
        this.setLoading(true);
        const snapshot = await fr.collection("correosBD").orderBy("data.fechaRegistro").get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data(),
              fechaRegistro: fn.fechaFormato(doc.data().data.fechaRegistro),
            });
          });
          console.log(temp),
          this.data = temp;
        }
        this.setLoading(false);
      } catch (error) {
        console.log("ERROR");
        console.warn(error);
        this.setLoading(false);
      }
    },

    verDatosFacturacion(dataInfo){
      this.userDialogInfo = dataInfo;
      this.dialogData = true;
    },

    clearMail(){
      this.dialogMail = false;
      this.fileForMail = null;
    },

    async guardarImage(file, fileName, contentType, extension) {
      const storageRef = storage.ref();
      const metaData = {
        cacheControl: "public,max-age=3600",
        contentType,
      };
      return await storageRef
        .child("emailFiles/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
    },

    async sendMail(){
      this.setLoading(true);
      var template = "";
      switch(this.correoSelected){
        case 0: template = "Bienvenida"; break;
        case 1: template = "boletinMail"; break;
      }
      
      var correos = [];
      this.selected.forEach((doc) => {
        correos.push(doc.data.correo);
      });
      
      try{    
        const GUID = uuidv4();
        const docContentType = "image/" + this.imgExtension;

        console.log("EL FILE: ",docContentType);
        console.log(template);

        const docSnap = await this.guardarImage(
          this.imageTempURL,
          GUID,
          docContentType,
          this.imgExtension
        );
        const docRefUrl = await docSnap.ref.getDownloadURL();
        await fr
        .collection("mail")
        .add({
          to: correos,
          template: {
              name: template, 
              data: {
                imagePath: docRefUrl,
                imgUrl: this.urlForMail,
                unSuscribeUrl: "https://electoraltech.com.mx/unsuscribe/?userMail="
              },
          },
        });
        this.setLoading(false);
        this.setTaskCompleted({
        message: "Correos Enviados!",
        color: "success",
        });
        this.fileForMail = null;
        this.dialogMail = false;
      }catch(e){
        this.setLoading(false);
        this.dialogMail = false;
        console.log(e.message);
        this.setTaskCompleted({
        message: "No Se Logró Enviar Los Correo",
        color: "red",
        });
      }

    },



  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
  },

  watch: {
    imgForMail() {
      const reader = new FileReader();
      reader.readAsDataURL(this.imgForMail);
      reader.onload = (e) => {
        this.imageTempURL = e.target.result;
        this.imgExtension = this.imgForMail.type.split("image/")[1];
      };
    },
    // fileForMail(val){
    //   if(val!=null){
    //     this.setLoading(true);
    //     try{
    //       const reader = new FileReader();
    //       reader.readAsDataURL(this.fileForMail);
    //       reader.onload = (e) => {
    //         this.pdfTempURL = e.target.result;
    //       };          
    //       this.setLoading(false);
    //     }catch (error) {
    //       console.log(error.message);
    //       this.setLoading(false);
    //     }
    //   }
    // },
  },
};
</script>

<style scoped>
.theme--light.v-icon {
  color: blue !important;
}
.v-input--selection-controls__ripple.green--text {
   color: blue !important;
}
</style>