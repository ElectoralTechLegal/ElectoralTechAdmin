<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary" class="mr-2"> mdi-alarm-panel </v-icon>
        Relación De Transacciones
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar Transacción...."
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
            <template v-slot:[`item.solicitudState`]="{ item }">
                <v-chip
                  label
                  text-color="red"
                  v-if="item.solicitudEstado==1"
                >
                  FACTURA SOLICITADA
                </v-chip>
                <v-chip
                  label
                  text-color="green"
                  v-if="item.solicitudEstado==2"
                >
                  FACTURA ENVIADA
                </v-chip>
                <!-- <v-icon small @click="deleteItemF(item)"> mdi-delete </v-icon> -->
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mx-1" @click="enviarMail(item)" color="primary">
                  mdi-email-plus
                </v-icon>

                <v-icon class="mx-1" @click="verDatosFacturacion(item)" color="#042230">
                  mdi-clipboard-list
                </v-icon>
                <!-- <v-icon small @click="deleteItemF(item)"> mdi-delete </v-icon> -->
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
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
          <b>ENVIAR FACTURA</b>
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
              <v-col 
              cols="12"
              md="6"
              >
              CLIENTE: 
              <v-chip
              >
                {{userDialogInfo.datosFacturacion.nombre}}
              </v-chip>
              </v-col>
              <v-col 
              cols="12"
              md="6"
              >
              RFC: 
              <v-chip
              >
                {{userDialogInfo.datosFacturacion.rfc}}
              </v-chip>
              </v-col>
              <v-col cols="12">
                <v-file-input
                placeholder="Factura Electronica"
                chips
                outlined
                dense
                v-model="fileForMail"
                >
                </v-file-input>
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
              ENVIAR FACTURA
            </v-btn>
          </v-card-actions>
      </v-card>
      

    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogData"
    >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >Informacion Detallada 
          <v-spacer></v-spacer>
          <v-btn
              text
              @click="dialogData = false"
            >
            <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Nombre: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.nombre}}
                </v-col>
                <v-col cols="12" md="6">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      RFC: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.rfc}}
                </v-col>
                <v-col cols="12" md="6">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Codigo Postal: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.codigoPostal}}
                </v-col>
                <v-col cols="12" md="6">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Estado: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.estado}}
                </v-col>
                <v-col cols="12">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Colonia: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.colonia}}
                </v-col>
                <v-col cols="12" md="6">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Calle: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.calle}}
                </v-col>
                <v-col cols="12" md="6">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      No. Ext.: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.noExterior}}
                </v-col>
                <v-col cols="12">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Correo Facturacion: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.correoFactura}}
                </v-col>
                <v-col cols="12">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      telefono: 
                    </v-chip>
                    {{userDialogInfo.datosFacturacion.Teléfono}}
                </v-col>
                <v-col cols="12">
                    <v-chip
                      class="ma-2"
                      color="secondary"
                      label
                    >
                      Monto: 
                    </v-chip>
                    {{userDialogInfo.monto}}
                </v-col>
              </v-row>
          </v-card-text>
        </v-card>
    </v-dialog>

  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { required } from "vuelidate/lib/validators";
import { v4 as uuidv4 } from "uuid";
import { fr, storage } from "../firebase.js";
//import fn from '../lib/index';

export default {
  name: "Facturacion",
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Facturacion", disabled: false, to: "facturacion" },
    ]);
    this.obtenerPosts();
  },
  data() {
    return {
      files: [],
      imageTempURL: "",
      imgExtension: "",
      fileTempURL: "",
      fileExtencion: "",
      filesAd: [],
      pdfTempURL: "",
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
      dialogMail: false,
      fileForMail: [],
      search: "",
      headers: [
        { text: "ID", align: "start", value: "paypal_id" },
        { text: "Paypal-Name", align: "start", value: "payer_name" },
        { text: "Nombre", align: "start", value: "datosFacturacion.nombre"},
        { text: "RFC", align: "start", value: "datosFacturacion.rfc" },
        { text: "Monto", align: "start", value: "monto" },
        { text: "Estado", align: "start", value: "solicitudState", sortable: true },
        { text: "Acciones", align: "start", value: "actions" },
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

    async obtenerPosts() {
      try {
        this.setLoading(true);
        const snapshot = await fr.collection("relacionPagos").orderBy("datosFacturacion.fechaRegistroPago").get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data(),
              //fechaRegistro: fn.fechaFormato(doc.data().fecha_registro),
            });
          });
          this.data = temp;
          console.log("LOS DATOS: ",this.data);
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

    enviarMail(data){
      console.log(data);
      this.dialogMail = true;
      this.userDialogInfo = data;
    },

    async sendMail(){
      this.setLoading(true);
      try{
        await fr
        .collection("mail")
        .add({
          //to: this.datosFacturacion.correoFactura,
          to: this.userDialogInfo.datosFacturacion.correoFactura,
          template: {
              name: "facturaEnviadaMail", 
              data: {
                  nombre: this.userDialogInfo.datosFacturacion.nombre,
                  id_paypal: this.userDialogInfo.paypal_id,
                  imagePath: this.pdfTempURL,
              },
          },
        });
        await fr.collection("relacionPagos").doc(this.userDialogInfo.id).update({
          solicitudEstado: 2,
        });
        await this.obtenerPosts();
        this.setLoading(false);
        this.setTaskCompleted({
        message: "Factura Electrónica Enviada!",
        color: "success",
        });
        this.fileForMail = null;
        this.dialogMail = false;
      }catch(e){
        this.setLoading(false);
        this.dialogMail = false;
        console.log(e.message);
        this.setTaskCompleted({
        message: "No Se Logró Enviar El Correo",
        color: "red",
        });
      }

    },

    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("invalido");
        this.setTaskCompleted({
          message: "Error, complete los campos",
          color: "red",
        });
      } else {
        try {
          this.setLoading(true);
          const GUID = uuidv4();
          const imgContentType = "image/" + this.imgExtension;
          const imgPromise = this.guardarFile(
            this.imageTempURL,
            GUID,
            imgContentType,
            this.imgExtension
          );
          const pdfPromise = this.guardarFile(
            this.pdfTempURL,
            GUID,
            "application/pdf",
            "pdf"
          );

          Promise.all([imgPromise, pdfPromise]).then((res) => {
            console.log(res);
            const imgSnap = res[0];
            const pdfSnap = res[1];

            const imgRefProm = imgSnap.ref.getDownloadURL();
            const pdfSnapProm = pdfSnap.ref.getDownloadURL();

            Promise.all([imgRefProm, pdfSnapProm]).then(async (resURL) => {
              console.log(resURL);

              const blogData = {
                image: resURL[0],
                pdf: resURL[1],
                titulo: this.titulo,
                descripcion: this.descripcion,
                contenido: this.contenido,
                categorias: this.categoriaSelected,
                fechaRegistro: Date.now(),
                estatus: 1,
                prime: this.prime.value,
              };

              await fr.collection("blog").doc().set(blogData);
              this.setTaskCompleted({
                message: "Nuevo post publicado !",
                color: "success",
              });
              this.limpiarForm();
              this.$v.$reset();
            });
          });
        } catch (error) {
          console.error(error);
          this.setTaskCompleted({
            message:
              "Error, revisa que los datos y archivos que cargaste sean del tipo correcto e intenta de nuevo",
            color: "error",
          });
        } finally {
          this.setLoading(false);
        }
      }
    },

    async guardarFile(file, fileName, contentType, extension) {
      const storageRef = storage.ref();

      const metaData = {
        cacheControl: "public,max-age=300",
        contentType,
      };

      return await storageRef
        .child("blog/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
    },


  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
  },
  watch: {
    fileForMail(val){
      if(val!=null){
        this.setLoading(true);
        try{
          const reader = new FileReader();
          reader.readAsDataURL(this.fileForMail);
          reader.onload = (e) => {
            this.pdfTempURL = e.target.result;
          };          
          this.setLoading(false);
        }catch (error) {
          console.log(error.message);
          this.setLoading(false);
        }
      }
    },
  },
};
</script>