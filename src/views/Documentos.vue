<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary"  class="mr-2"> mdi-link-box-variant </v-icon>
        Administración de contenido de DocsAndFiles
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text>
        <v-form @submit.prevent="guardar">
          <v-row>
            <v-col cols="12" lg="12">
              <div class="text-lg-h6 text-md-h6 text-xs-h6">Agregar Documento</div>
              <v-divider></v-divider>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      label="Titulo"
                      prepend-icon="mdi-form-textarea"
                      v-model="titulo"
                      clearable
                      filled
                      required
                      @input="$v.titulo.$touch()"
                      @blur="$v.titulo.$touch()"
                      :error-messages="tituloErrors"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-select
                      label="Tipo"
                      prepend-icon="mdi-form-textarea"
                      v-model="tipo"
                      :items="types"
                      clearable
                      filled
                      required
                      @input="$v.tipo.$touch()"
                      @blur="$v.tipo.$touch()"
                      :error-messages="tipoErrors"
                    ></v-select>
                  </v-col>

                  <v-col>
                    <v-select
                      :items="filters"
                      value=""
                      item-key="name"
                      label="Filtro"
                      item-text="text"
                      item-value="value"
                      v-model="filterSelected"
                      outlined
                    ></v-select>
                  </v-col>


                  <v-col cols="12" sm="12">
                    <v-file-input
                      label="Archivo"
                      prepend-icon="mdi-link-plus"
                      v-model="files"
                      clearable
                      filled
                      required
                      @input="$v.files.$touch()"
                      @blur="$v.files.$touch()"
                      :error-messages="imgErrors"
                    ></v-file-input>
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
        <v-row>
          <v-col>
            <div class="text-lg-h6 text-md-h6 text-xs-h6">Documentos publicados</div>
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
              <template v-slot:[`item.estatus`]="{ item }">
                <v-switch
                  v-model="item.estatus"
                  @click="change(item)"
                  color="primary"
                ></v-switch>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="verIMG(item)" color="primary">
                  mdi-image-outline
                </v-icon>
                <!-- <v-icon small @click="deleteItemF(item)"> mdi-delete </v-icon> -->
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
import { v4 as uuidv4 } from "uuid";
import { fr, storage } from "../firebase.js";
import fn from '../lib/index';

export default {
  name: "documentos",
  beforeDestroy() {
    console.log("before");
  },
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Documentos", disabled: false, to: "documentos" },
    ]);
    this.obtenerPosts();
  },
  data() {
    return {
      files: [],
      types: ["pdf","otro"],
      imageTempURL: "",
      titulo: "",
      tipo: "",
      descripcion: "",
      link: "",
      imgExtension: "",
      search: "",

      filterSelected: 0,
      filters: [
        {value: 1, text: "Boletin"},
      ],

      headers: [
        { text: "Título", align: "start", value: "titulo_doc" },
        { text: "Tipo", align: "start", value: "type" },
        { text: "URL", align: "start", value: "url_publico" },
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
    limpiarForm() {
      this.files = [];
      this.imageTempURL = "";
      this.imgExtension = "";
      this.titulo = "";
      this.descripcion = "";
      this.link = "";
      this.tipo = "";
    },
    async guardarFile(file, fileName, contentType, extension) {
      const storageRef = storage.ref();
      const metaData = {
        cacheControl: "public,max-age=3600",
        contentType,
      };
      return storageRef
        .child("DocumentsAndFiles/" + fileName + "." + extension)
        .putString(file, "data_url", metaData);
    },

    async guardar() {
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
          const docContentType = "application/" + this.imgExtension;
          const docSnap = await this.guardarFile(
            this.imageTempURL,
            GUID,
            docContentType,
            this.imgExtension
          );

          const docRefUrl = await docSnap.ref.getDownloadURL();

          const data = {
            titulo_doc: this.titulo,
            type: this.tipo,
            url_doc: docRefUrl,
            fechaRegistro: Date.now(),
            boletin: this.filterSelected,
          };
          await fr.collection("documentosRef").doc().set(data);
          this.setTaskCompleted({
            message: "Nuevo Documento Guardado !",
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
        const snapshot = await fr.collection("documentosRef").orderBy("fechaRegistro").get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data(),
              fechaRegistro: fn.fechaFormato(doc.data().fechaRegistro),
              url_publico: " https://electoraltech.com.mx/Documents/?document_id="+ doc.id,
            });
          });
          this.data = temp;
        }
        this.setLoading(false);
      } catch (error) {
        console.log("ERROR");
        console.warn(error);
        this.setLoading(false);
      }
    },
    verIMG(post) {
      window.open(post.image, "_blank");
    },
  },
  validations: {
    imageTempURL: { required },
    titulo: { required },
    tipo: {required}
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
    imgErrors() {
      const errors = [];
      if (!this.$v.imageTempURL.$dirty) return errors;
      !this.$v.imageTempURL.required &&
        errors.push("El documento es invalido / requerido");
      return errors;
    },
    tituloErrors() {
      const errors = [];
      if (!this.$v.titulo.$dirty) return errors;
      !this.$v.titulo.required && errors.push("El titulo es requerido");
      return errors;
    },
    tipoErrors() {
      const errors = [];
      if (!this.$v.tipo.$dirty) return errors;
      !this.$v.tipo.required && errors.push("El tipo de documento es requerido");
      return errors;
    },
  },
  watch: {
    files() {
      const reader = new FileReader();
      reader.readAsDataURL(this.files);
      reader.onload = (e) => {
        this.imageTempURL = e.target.result;
        this.imgExtension = this.files.type.split("/")[1];
      };
    },
  },
};
</script>