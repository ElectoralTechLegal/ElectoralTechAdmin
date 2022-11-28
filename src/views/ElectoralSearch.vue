<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary"  class="mr-2"> mdi-link-box-variant </v-icon>
        Actualizar contenido de Electoral Search
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text>
        <v-tabs
          v-model="tab"
          background-color="#e8dbff"
          centered
          
          grow
        >
          <v-tabs-slider color="#7b1391"></v-tabs-slider>

          <v-tab href="#tab-1" @click="Documento='acuerdo',limpiarForm()">
            ACUERDOS
          </v-tab>
          <v-tab href="#tab-2" @click="Documento='expediente',limpiarForm()">
            EXPEDIENTES
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="mt-4">
          <v-tab-item
          :value="'tab-1'"
          >
            <v-form @submit.prevent="guardarAcuerdo">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-card elevation="20">
                    
                    <v-card-title class="title ml-3" style="color:#ba34eb"> ARCHIVO A SUBIR </v-card-title>
                    <v-card-text>
                      <v-file-input
                        label="Documento"
                        filled
                        counter
                        v-model="files"
                        prepend-icon="mdi-file"
                        :show-size="1000"
                        required
                        @input="$v.imageTempURL.$touch()"
                        @blur="$v.imageTempURL.$touch()"
                        accept="file/pdf"
                        :error-messages="imgErrors"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small label color="primary">
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>

                      <v-select
                          label="Organo"
                          prepend-icon="mdi-home-city"
                          v-model="Doc_Organo"
                          :items="organosDisponibles"
                          clearable
                          filled
                          required
                          @input="$v.Doc_Organo.$touch()"
                          @blur="$v.Doc_Organo.$touch()"
                          :error-messages="organoErrors"
                      ></v-select>

                      <v-text-field
                          label="Fecha"
                          prepend-icon="mdi-calendar-month"
                          v-model="Fecha"
                          type="date"
                          clearable   
                          filled
                          required
                      ></v-text-field>

                      <v-text-field
                          label="Num. Expediente"
                          prepend-icon="mdi-counter"
                          v-model="Num_Expediente"
                          clearable   
                          filled
                          required
                          @input="$v.Num_Expediente.$touch()"
                          @blur="$v.Num_Expediente.$touch()"
                          :error-messages="expedienteErrors"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <div class="text-lg-h6 text-md-h6 text-xs-h6">Datos</div>
                  <v-divider></v-divider>

                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">

                        <v-select
                          label="Estado"
                          prepend-icon="mdi-map-marker-radius"
                          v-model="Estado"
                          :items="estadosDisponibles"
                          clearable
                          filled
                          required
                          @input="$v.Estado.$touch()"
                          @blur="$v.Estado.$touch()"
                          :error-messages="estadoErrors"
                      ></v-select>

                        <v-text-field
                          label="Nombre Del Documento"
                          prepend-icon="mdi-alphabetical-variant"
                          v-model="Doc_Name"
                          clearable
                          filled
                          required
                          @input="$v.Doc_Name.$touch()"
                          @blur="$v.Doc_Name.$touch()"
                          :error-messages="tituloErrors"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label="Tipo De Impugnacion"
                          prepend-icon="mdi-form-textarea"
                          v-model="Doc_Type"
                          :items="docTypesDisponibles"
                          clearable
                          filled
                          required
                          @input="$v.Doc_Type.$touch()"
                          @blur="$v.Doc_Type.$touch()"
                          :error-messages="descErrors"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col align-self="end">
                        <v-btn type="submit" color="primary" :loading="loading">
                          <v-icon> mdi-content-save </v-icon>
                          Guardar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-form>
          </v-tab-item>

          <v-tab-item
          :value="'tab-2'"
          >
            <v-form @submit.prevent="guardarExpediente">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-card elevation="20">
                    
                    <v-card-title class="title ml-3" style="color:#ba34eb"> ARCHIVO A SUBIR </v-card-title>
                    <v-card-text>
                      <v-file-input
                        label="Documento"
                        filled
                        counter
                        v-model="files"
                        prepend-icon="mdi-file"
                        :show-size="1000"
                        required
                        @input="$v.imageTempURL.$touch()"
                        @blur="$v.imageTempURL.$touch()"
                        accept="file/pdf"
                        :error-messages="imgErrors"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small label color="primary">
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>

                      <v-select
                          label="Organo"
                          prepend-icon="mdi-home-city"
                          v-model="Doc_Organo"
                          :items="organosDisponibles"
                          clearable
                          filled
                          required
                          @input="$v.Doc_Organo.$touch()"
                          @blur="$v.Doc_Organo.$touch()"
                          :error-messages="organoErrors"
                      ></v-select>

                      <v-text-field
                          label="Num. Expediente"
                          prepend-icon="mdi-counter"
                          v-model="Num_Expediente"
                          clearable   
                          filled
                          required
                          @input="$v.Num_Expediente.$touch()"
                          @blur="$v.Num_Expediente.$touch()"
                          :error-messages="expedienteErrors"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <div class="text-lg-h6 text-md-h6 text-xs-h6">Datos</div>
                  <v-divider></v-divider>

                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">

                        <v-select
                          label="Estado"
                          prepend-icon="mdi-map-marker-radius"
                          v-model="Estado"
                          :items="estadosDisponibles"
                          clearable
                          filled
                          required
                          @input="$v.Estado.$touch()"
                          @blur="$v.Estado.$touch()"
                          :error-messages="estadoErrors"
                      ></v-select>

                        <v-text-field
                          label="Nombre Del Documento"
                          prepend-icon="mdi-alphabetical-variant"
                          v-model="Doc_Name"
                          clearable
                          filled
                          required
                          @input="$v.Doc_Name.$touch()"
                          @blur="$v.Doc_Name.$touch()"
                          :error-messages="tituloErrors"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label="Tipo De Impugnacion"
                          prepend-icon="mdi-form-textarea"
                          v-model="Doc_Type"
                          :items="docTypesDisponibles"
                          clearable
                          filled
                          required
                          @input="$v.Doc_Type.$touch()"
                          @blur="$v.Doc_Type.$touch()"
                          :error-messages="descErrors"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col align-self="end">
                        <v-btn type="submit" color="primary" :loading="loading">
                          <v-icon> mdi-content-save </v-icon>
                          Guardar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-form>
          </v-tab-item>
        </v-tabs-items>


        <v-row>
          <v-col>
            <div class="text-lg-h6 text-md-h6 text-xs-h6 ml-2 mt-4">DOCUMENTOS PUBLICADOS</div>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Búsqueda en publicaciones..."
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
            <!--
              <template v-slot:[`item.estatus`]="{ item }">
                <v-switch
                  v-model="item.estatus"
                  @click="change(item)"
                  color="primary"
                ></v-switch>
              </template> -->

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="verIMG(item)" color="primary">
                  mdi-file-document
                </v-icon>

               <v-icon color="red" class="ml-2" @click="deleteDocumentIndexing(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { required } from "vuelidate/lib/validators";
//import { v4 as uuidv4 } from "uuid";
import { fr, storage } from "../firebase.js";
//import fn from '../lib/index';

export default {
  name: "electoralSearch",
  beforeDestroy() {
    console.log("before");
  },
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Electoral-Search", disabled: false, to: "electoralSearch" },
    ]);
    this.obtenerPosts();
    this.Documento = "acuerdo";
  },
  data() {
    return {
      tab: null,
      files: [],
      imageTempURL: "",
      titulo: "",
      descripcion: "",
      link: "",
      imgExtension: "",
      search: "",

      Documento: "",
      Doc_Name: "",
      Doc_Organo: "",
      Doc_Type: "",
      Doc_Url: "",
      Estado: "",
      Fecha: "",
      Num_Expediente: "",


      organosDisponibles: [
        {text: "Tribunal Electoral de Veracruz" , value: "tev"},
        {text: "Sala Xalapa" , value: "sx"},
      ],

      estadosDisponibles: [
        {text:"Veracruz" , value: "veracruz"},
      ],

      docTypesDisponibles: [
        {text:"JRC" , value: "jrc"},
        {text:"JDC" , value: "jdc"},
        {text:"PES" , value: "pes"},
        {text:"RIN" , value: "rin"},
        {text:"RAP" , value: "rap"},
        {text:"REP" , value: "rep"},
        {text:"JIN" , value: "jin"},
        {text:"JE" , value: "je"},
        {text:"AG" , value: "ag"},
      ],

      WindowSelected: 0,
    
      headers: [
        { text: "Num. Expediente", align: "start", value: "Num_Expediente" },
        { text: "Titulo", align: "start", value: "Doc_Name" },
        { text: "Organo", align: "start", value: "organo" },
        { text: "Tipo Documento", align: "start", value: "Documento" },
        { text: "Fecha", align: "start", value: "fechaRegistro" },
        { text: "Acciones", align: "start", value: "actions" },
      ],
      data: [],
      cambioStatus: false,
    };
  },

  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setBreadInit: "settingsModule/setBreadInit",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),

    test(){
      console.log("El Archvio:");
      console.log(this.files.name);
    },
    
    limpiarForm() {
      this.files = null;
      this.imageTempURL = "";
      this.imgExtension = "";
      this.Doc_Name = "";
      this.Doc_Organo = "";
      this.Doc_Type = "";
      this.Estado = "";
      this.Num_Expediente = "";
      this.Fecha = null;
      
    },

    async guardarFileExpediente(file, fileName, contentType, extension) {
      const storageRef = storage.ref();

      const metaData = {
        cacheControl: "public,max-age=3600",
        contentType,
      };
      const nombreCarpeta = this.Num_Expediente.slice(0, -5) + "-" + this.Num_Expediente.slice(-4,this.Num_Expediente.length);
      if(this.Doc_Organo == "tev"){
        return storageRef
        .child("ElectoralSearch/TEV/EXPEDIENTES/"+nombreCarpeta+"/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
      }else{
        return storageRef
        .child("ElectoralSearch/SX/EXPEDIENTES/"+nombreCarpeta+"/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
      }
    },

    async guardarFileAcuerdo(file, fileName, contentType, extension) {
      const storageRef = storage.ref();
      const metaData = {
        cacheControl: "public,max-age=3600",
        contentType,
      };
      const nombreCarpeta = this.Fecha;
      if(this.Doc_Organo == "tev"){
        return storageRef
        .child("ElectoralSearch/TEV/ACUERDOS/"+nombreCarpeta+"/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
      }else{
        return storageRef
        .child("ElectoralSearch/SX/ACUERDOS/"+nombreCarpeta+"/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
      }
    },

    async guardarAcuerdo(){
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.setTaskCompleted({
          message: "Error, complete los campos",
          color: "red",
        });
      } else {
        try {
          this.setLoading(true);
          console.log("EL BOTON GUARDAR HACE: "+"\n");
                    
          //const GUID = uuidv4();
          const imgContentType = "application/" + this.imgExtension;
          const imgSnap = await this.guardarFileAcuerdo(
            this.imageTempURL,
            this.Doc_Name,
            imgContentType,
            this.imgExtension
          );
          const imgRefProm = await imgSnap.ref.getDownloadURL();
          console.log("El Link:    " + imgRefProm);  
          const dataInfo = {
            Doc_Name: this.Doc_Name,
            Doc_Organo: this.Doc_Organo,
            Doc_Type: this.Doc_Type,
            Doc_Url: imgRefProm,
            Documento: "acuerdo",
            Estado: this.Estado,
            Fecha: this.Fecha,
            Num_Expediente: this.Num_Expediente,
          };
          console.log(dataInfo);

          await fr.collection("electoralSearch").doc().set(dataInfo);
          await this.guardarExpediente();
          this.setTaskCompleted({
            message: "Se Agregó El Expediente Exitosamente!",
            color: "success",
          });
          this.limpiarForm();
          this.$v.$reset();
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

    async guardarExpediente() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.setTaskCompleted({
          message: "Error, complete los campos",
          color: "red",
        });
      } else {
        try {
          this.setLoading(true);
          console.log("EL BOTON GUARDAR HACE: "+"\n");
                    
          //const GUID = uuidv4();
          const imgContentType = "application/" + this.imgExtension;
          const imgSnap = await this.guardarFileExpediente(
            this.imageTempURL,
            this.Doc_Name,
            imgContentType,
            this.imgExtension
          );
          const imgRefProm = await imgSnap.ref.getDownloadURL();
          console.log("El Link:    " + imgRefProm);  
          const dataInfo = {
            Doc_Name: this.Doc_Name,
            Doc_Organo: this.Doc_Organo,
            Doc_Type: this.Doc_Type,
            Doc_Url: imgRefProm,
            Documento: "expediente",
            Estado: this.Estado,
            Num_Expediente: this.Num_Expediente,
          };
          console.log(dataInfo);

          await fr.collection("electoralSearch").doc().set(dataInfo);
          this.setTaskCompleted({
            message: "Se Agregó El Expediente Exitosamente!",
            color: "success",
          });
          this.limpiarForm();
          this.$v.$reset();
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
    async obtenerPosts() {
      try {
        this.setLoading(true);
        const snapshot = await fr.collection("electoralSearch").orderBy("Fecha").get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data(),
              fechaRegistro: doc.data().Fecha,
              organo: doc.data().Doc_Organo.toUpperCase(),  
            });
          });
          this.data = temp;
          console.log(this.data);
        }
        this.setLoading(false);
      } catch (error) {
        console.log("ERROR");
        console.warn(error);
        this.setLoading(false);
      }
    },
    async change(post) {
      try {
        this.setLoading(true);
        const newStatus = { estatus: post.estatus ? 1 : 0 };
        console.log({ post });
        console.log({ newStatus });
        await fr.collection("learning").doc(post.id).update(newStatus);

        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
        console.error(error);
      }
    },
    verIMG(post) {
      window.open(post.Doc_Url, "_blank");
    },
  },
  validations: {
    imageTempURL: { required },
    Doc_Organo: { required },
    Num_Expediente: { required },
    Estado: { required },
    Doc_Name: { required },
    Doc_Type: { required },
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
    imgErrors() {
      const errors = [];
      if (!this.$v.imageTempURL.$dirty) return errors;
      !this.$v.imageTempURL.required &&
        errors.push("Un documento .PDF es requerido");
      return errors;
    },
    organoErrors() {
      const errors = [];
      if (!this.$v.Doc_Organo.$dirty) return errors;
      !this.$v.Doc_Organo.required &&
        errors.push("Especificar un organo es requerido");
      return errors;
    },
    expedienteErrors(){
      const errors = [];
      if (!this.$v.Num_Expediente.$dirty) return errors;
      !this.$v.Num_Expediente.required &&
        errors.push("El numero de expediente es requerido");
      return errors;
    },
    estadoErrors(){
      const errors = [];
      if (!this.$v.Estado.$dirty) return errors;
      !this.$v.Estado.required && errors.push("Especificar el estado es requerido");
      return errors;
    },
    tituloErrors() {
      const errors = [];
      if (!this.$v.Doc_Name.$dirty) return errors;
      !this.$v.Doc_Name.required && errors.push("El nombre del archivo es requerido");
      return errors;
    },
    descErrors() {
      const errors = [];
      if (!this.$v.Doc_Type.$dirty) return errors;
      !this.$v.Doc_Type.required &&
        errors.push("El tipo de documento es requerido");
      return errors;
    },
  },
  watch: {
    files() {
      if (this.files != null){
        const reader = new FileReader();
        reader.readAsDataURL(this.files);
        reader.onload = (e) => {
          this.imageTempURL = e.target.result;
          this.imgExtension = this.files.type.split("application/")[1];
        };
        this.Doc_Name = this.files.name.slice(0, -4); 
      }
    },
    /*
    files(val) {
      if (!val) return;
      whatever
    },
    */
  },
};
</script>

<style scoped>
</style>