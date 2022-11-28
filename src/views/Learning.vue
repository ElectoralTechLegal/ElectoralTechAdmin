<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary"  class="mr-2"> mdi-link-box-variant </v-icon>
        Administración de contenido de E-learning
      </v-card-title>
      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text>
        <v-form @submit.prevent="guardar">
          <v-row>
            <v-col cols="12" lg="6">
              <v-card>
                <v-img
                  :src="imageTempURL"
                  aspect-ratio="3"
                  class="grey darken-4"
                ></v-img>
                <v-card-title class="title"> Portada del post </v-card-title>
                <v-card-text>
                  <v-file-input
                    label="Selecciona una imagen"
                    filled
                    counter
                    v-model="files"
                    prepend-icon="mdi-file-image-outline"
                    :show-size="1000"
                    required
                    @input="$v.imageTempURL.$touch()"
                    @blur="$v.imageTempURL.$touch()"
                    accept="image/*"
                    :error-messages="imgErrors"
                  >
                    <template v-slot:selection="{ text }">
                      <v-chip small label color="primary">
                        {{ text }}
                      </v-chip>
                    </template>
                  </v-file-input>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <div class="text-lg-h6 text-md-h6 text-xs-h6">Datos</div>
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
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      label="Descripción"
                      prepend-icon="mdi-form-textarea"
                      v-model="descripcion"
                      clearable
                      filled
                      required
                      @input="$v.descripcion.$touch()"
                      @blur="$v.descripcion.$touch()"
                      :error-messages="descErrors"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Link"
                      prepend-icon="mdi-link-plus"
                      v-model="link"
                      clearable
                      filled
                      required
                      @input="$v.link.$touch()"
                      @blur="$v.link.$touch()"
                      :error-messages="linkError"
                    ></v-text-field>
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
            <div class="text-lg-h6 text-md-h6 text-xs-h6">Posts publicados</div>
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
  name: "Learning",
  beforeDestroy() {
    console.log("before");
  },
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "E-learning", disabled: false, to: "elearning" },
    ]);
    this.obtenerPosts();
  },
  data() {
    return {
      files: [],
      imageTempURL: "",
      titulo: "",
      descripcion: "",
      link: "",
      imgExtension: "",
      search: "",
      filterSelected: 0,
      filters: [
        {value: 1, text: "Abogado Artificial"},
        {value: 2, text: "Boletin Semanal"},
        {value: 3, text: "Conferencia"},
        {value: 3, text: "Otros"},
      ],
      headers: [
        { text: "Título", align: "start", value: "titulo" },
        { text: "Descripción", align: "start", value: "descripcion" },
        { text: "Fecha registro", align: "start", value: "fechaRegistro" },
        { text: "Acciones", align: "start", value: "actions" },
        { text: "Estatus", align: "start", value: "estatus" },
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
    },
    async guardarFile(file, fileName, contentType, extension) {
      const storageRef = storage.ref();

      const metaData = {
        cacheControl: "public,max-age=3600",
        contentType,
      };

      return storageRef
        .child("learning/" + fileName + "." + extension)
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
          const imgContentType = "image/" + this.imgExtension;
          const imgSnap = await this.guardarFile(
            this.imageTempURL,
            GUID,
            imgContentType,
            this.imgExtension
          );
          const imgRefProm = await imgSnap.ref.getDownloadURL();
          const data = {
            image: imgRefProm,
            titulo: this.titulo,
            descripcion: this.descripcion,
            link: this.link,
            fechaRegistro: Date.now(),
            estatus: 1,
            filtro: this.filterSelected,
          };
          console.log(data);

          await fr.collection("learning").doc().set(data);
          this.setTaskCompleted({
            message: "Nuevo post publicado !",
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
        const snapshot = await fr.collection("learning").orderBy("fechaRegistro").get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data(),
              fechaRegistro: fn.fechaFormato(doc.data().fechaRegistro),
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
      window.open(post.image, "_blank");
    },
  },
  validations: {
    imageTempURL: { required },
    titulo: { required },
    descripcion: { required },
    link: { required },
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
    imgErrors() {
      const errors = [];
      if (!this.$v.imageTempURL.$dirty) return errors;
      !this.$v.imageTempURL.required &&
        errors.push("La imagen de portada es requerida");
      return errors;
    },
    tituloErrors() {
      const errors = [];
      if (!this.$v.titulo.$dirty) return errors;
      !this.$v.titulo.required && errors.push("El titulo es requerido");
      return errors;
    },
    descErrors() {
      const errors = [];
      if (!this.$v.descripcion.$dirty) return errors;
      !this.$v.descripcion.required &&
        errors.push("La descripción es requerida");
      return errors;
    },
    linkError() {
      const errors = [];
      if (!this.$v.link.$dirty) return errors;
      !this.$v.link.required && errors.push("El link es requerido");
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