<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary" class="mr-2"> mdi-file-edit </v-icon>
        Administración de contenido del blog
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
                <v-card-title class="title"> Portada del blog </v-card-title>
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

                  <v-select
                      v-model="filtroSelected"
                      :items="filtroCategorias"
                      label="Filtro"
                      prepend-icon="mdi-format-list-checks"
                      chips
                      filled
                      hint="Selecciona el filtro asosiado"
                      item-text="texto"
                      item-value="id"
                      return-object
                      persistent-hint
                      required
                      @input="$v.filtroSelected.$touch()"
                      @blur="$v.filtroSelected.$touch()"
                      :error-messages="filtroErros"
                  ></v-select>

                  <v-text-field
                      label="Fecha de Publicacion"
                      prepend-icon="mdi-form-textarea"
                      v-model="fechaRegis"
                      clearable
                      filled
                      required
                      type="date"
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
                    <v-text-field
                      label="Titulo del blog"
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
                    <v-select
                      v-model="categoriaSelected"
                      :items="categorias"
                      label="Categorias"
                      prepend-icon="mdi-format-list-checks"
                      multiple
                      chips
                      filled
                      hint="Selecciona las categorias asociadas"
                      item-text="texto"
                      item-value="id"
                      return-object
                      persistent-hint
                      required
                      @input="$v.categoriaSelected.$touch()"
                      @blur="$v.categoriaSelected.$touch()"
                      :error-messages="catErrors"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-file-input
                      label="Archivo adjunto"
                      filled
                      counter
                      v-model="filesAd"
                      prepend-icon="mdi-file-pdf-box"
                      :show-size="1000"
                      required
                      @input="$v.pdfTempURL.$touch()"
                      @blur="$v.pdfTempURL.$touch()"
                      :error-messages="pdfErrors"
                      accept=".pdf"
                    >
                      <template v-slot:selection="{ text }">
                        <v-chip small label color="primary">
                          {{ text }}
                        </v-chip>
                      </template>
                    </v-file-input>
                  </v-col>
                  <v-col cols="9" sm="9">
                    <v-select
                      v-model="prime"
                      :items="primeSelector"
                      label="Mostras a Los Usuarios:"
                      prepend-icon="mdi-format-list-checks"
                      filled
                      hint="Selecciona si el post estara solo disponible para miembros prime"
                      item-text="text"
                      item-value="value"
                      return-object
                      persistent-hint
                      required
                      @input="$v.prime.$touch()"
                      @blur="$v.prime.$touch()"
                      :error-messages="primeErrors"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" sm="3">
                    <v-checkbox
                      v-model="blogListaCheck"
                      label="Post Lista"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" v-if="blogListaCheck">
                    <v-text-field
                      label="Título de la lista temática"
                      prepend-icon="mdi-form-textarea"
                      v-model="tituloLista"
                      clearable
                      filled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" v-if="blogListaCheck">
                    <v-text-field
                      label="Título del primer documento"
                      prepend-icon="mdi-form-textarea"
                      v-model="documentoTitulo"
                      clearable
                      filled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-textarea
                name="input-7-1"
                filled
                clearable
                counter
                label="Contenido"
                auto-grow
                required
                :error-messages="contetErrors"
                v-model="contenido"
              ></v-textarea>
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
        </v-form>
        <v-row>
          <v-col>
            <div class="text-lg-h6 text-md-h6 text-xs-h6 text-center">Posts publicados</div>  
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Búsqueda en post publicados..."
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

                  <!-- <v-icon @click="verPDF(item)" color="primary">
                  mdi-file-pdf-box
                  </v-icon> -->

                  <v-icon @click="addPDFtoList(item)" color="green" v-if="item.blogListaCheck"> mdi-file-plus </v-icon>
                </template>
              </v-data-table>
            <div class="text-lg-h6 text-md-h6 text-xs-h6 text-center">Listas de sentencias</div>  

            <v-data-table
                class="elevation-1"
                :headers="headers"
                :items="data"
                :search="search_1"
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
                <!--
                 <v-icon @click="verPDF(item)" color="primary">
                  mdi-file-pdf-box
                </v-icon> -->

                <v-icon @click="addPDFtoList(item)" color="green" v-if="item.blogListaCheck"> mdi-file-plus </v-icon>
              </template>
              
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>





    <v-dialog
      v-model="dialogAddFile"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Agregar documento a la lista
        </v-card-title>
        <v-card-text>
          <v-row class="mt-2">

            <v-col cols="12" sm="12" md="12">
              <v-text-field
                label="Nombre que se mostrara en la lista"
                prepend-icon="mdi-form-textarea"
                v-model="addFileTitle"
                clearable
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-file-input
                label="Archivo adjunto que se añadira a la lista"
                filled
                counter
                v-model="listFile"
                prepend-icon="mdi-file-pdf-box"
                :show-size="1000"
                accept=".pdf"
              >
                <template v-slot:selection="{ text }">
                  <v-chip small label color="primary">
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="savePDFtoList()"
          >
            Agregar Documento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { required } from "vuelidate/lib/validators";
import { v4 as uuidv4 } from "uuid";
import { fr, storage, firebase } from "../firebase.js";
import fn from '../lib/index';

export default {
  name: "Blog",
  mounted() {
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
      { text: "Blog", disabled: false, to: "blog" },
    ]);
    this.obtenerPosts();
  },
  data() {
    return {
      files: [],
      imageTempURL: "",
      imgExtension: "",
      filesAd: [],
      pdfTempURL: "",
      titulo: "",
      descripcion: "",
      contenido: "",
      categoriaSelected: [],
      prime: [],
      filtroCategorias: [
        { id: 1, texto: "Artículos académicos" },
        { id: 2, texto: "Sala Superior" },
        { id: 3, texto: "Sala Xalapa" },
        { id: 4, texto: "TEV" },
        { id: 5, texto: "Listas Tematicas" },
        { id: 6, texto: "Otros" },
      ],
      filtroSelected : "",
      fechaRegis: "",
      categorias: [
        { id: 1, texto: "Jurisdiccional" },
        { id: 2, texto: "Artículos académicos" },
        { id: 3, texto: "Administrativo" },
        { id: 4, texto: "Jurisdiccional" },
        { id: 5, texto: "Listas Tematicas" },
        { id: 6, texto: "Sala Xalapa" },
        { id: 7, texto: "Sala Superior" },
        { id: 8, texto: "TEV" },
      ],
      primeSelector: [
        {value: 0, text: "Usuario Gratuitos"},
        {value: 1, text: "Usuarios De Pago"},
      ],
      search: "",
      search_1: "sentencias",
      headers: [
        { text: "Link", align: "start", value: "id" },
        { text: "Título", align: "start", value: "titulo" },
        { text: "Descripción", align: "start", value: "descripcion" },
        { text: "Fecha registro", align: "start", value: "fechaRegistro" },
        { text: "Acciones", align: "start", value: "actions" },
        { text: "Estatus", align: "start", value: "estatus" },
      ],
      headers_1: [
        { text: "Link", align: "start", value: "id" },
        { text: "Título", align: "start", value: "titulo" },
        { text: "Descripción", align: "start", value: "descripcion" },

      ],
      data: [],
      cambioStatus: false,
      blogListaCheck: false,

      tituloLista: "",
      documentoTitulo: "",

      listFile: [],
      listFileTempUrl: "",
      dialogAddFile: false,
      addFileTitle: "",

      docToAddFile: "",
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
    filtroSelected: { required},
  },
  methods: {
    async obtenerPosts() {
      try {
        this.setLoading(true);
        const snapshot = await fr.collection("blog").orderBy("fechaRegistro").get();
        if (!snapshot.empty) {
          let temp = [];
          snapshot.forEach((doc) => {
            temp.push({
              id: "https://electoraltech.com.mx/blog-post/?blog_id="+doc.id,
              docid: doc.id,
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
        await fr.collection("blog").doc(post.id).update(newStatus);

        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
        console.error(error);
      }
    },
    addPDFtoList(itemData){
      this.docToAddFile = itemData.docid;
      this.dialogAddFile = true; 
    },

    savePDFtoList(){
      try{
        this.setLoading(true);
        const GUID = uuidv4();
        const pdfListPromise = this.guardarFile(
          this.listFileTempUrl,
          GUID,
          "application/pdf",
          "pdf"
        );
        Promise.all([pdfListPromise]).then((res) => {
          console.log(res);
          const pdfSnap = res[0];
          const pdfSnapProm = pdfSnap.ref.getDownloadURL();

          Promise.all([pdfSnapProm]).then(async (resURL) => {
            console.log(resURL);
            await fr
            .collection("blog")
            .doc(this.docToAddFile)
            .update({
              siguientesPDFs: firebase.firestore.FieldValue.arrayUnion({
                itemName: this.addFileTitle,
                itemUrl: resURL[0],
              }),
              fechaRegistro: Date.now(),
            });
            this.limpiarForm();
            this.$v.$reset();
            this.dialogAddFile = false;

            this.setTaskCompleted({
              message: "Nuevo Documento Agregado a La Lista!",
              color: "success",
            });
            
          });
        });
      }
      catch (error) {
        console.error(error);
        this.setTaskCompleted({
          message:
            "Error, revisa que los datos y archivos que cargaste sean del tipo correcto e intenta de nuevo",
          color: "error",
        });
        } finally {
          this.setLoading(false);
        }
    },


    verPDF(post){
      window.open(post.pdf, "_blank");
    },
    verIMG(post) {
      window.open(post.image, "_blank");
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
          var fechaAGuardar = "";

          if(this.fechaRegis != ""){
            var date = new Date(this.fechaRegis)
            fechaAGuardar = date.getTime();
          }else{
            fechaAGuardar = Date.now();
          }

          const filtroAGuardar = this.filtroSelected.id;

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
                fechaRegistro: fechaAGuardar,
                estatus: 1,
                filtro: filtroAGuardar,
                prime: this.prime.value,
                blogListaCheck: this.blogListaCheck,
                tituloLista: this.tituloLista,
                documentoTitulo: this.documentoTitulo,
                siguientesPDFs: null,
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
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setBreadInit: "settingsModule/setBreadInit",
      setTaskCompleted: "settingsModule/setTaskCompleted",
    }),
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

    limpiarForm() {
      this.files = [];
      this.imageTempURL = "";
      this.imgExtension = "";
      this.filesAd = [];
      this.pdfTempURL = "";
      this.titulo = "";
      this.descripcion = "";
      this.contenido = "";
      this.categoriaSelected = [];
      this.prime = [];
      this.fechaRegis = "",
      this.filtroSelected = "";
      this.tituloLista = "";
      this.blogListaCheck = false;
      this.documentoTitulo = "";

      this.listFile= [];
      this.dialogAddFile= false;
      this.addFileTitle= "";
      this.docToAddFile= "";
    },
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
    filtroErros() {
      const errors = [];
      if (!this.$v.filtroSelected.$dirty) return errors;
      !this.$v.filtroSelected.required && errors.push("El filtro es requerido");
      return errors;
    },
    descErrors() {
      const errors = [];
      if (!this.$v.descripcion.$dirty) return errors;
      !this.$v.descripcion.required &&
        errors.push("La descripción es requerida.");
      return errors;
    },
    catErrors() {
      const errors = [];
      if (!this.$v.categoriaSelected.$dirty) return errors;
      !this.$v.categoriaSelected.required &&
        errors.push("Seleccione al menos una categoría");
      return errors;
    },
    pdfErrors() {
      const errors = [];
      if (!this.$v.pdfTempURL.$dirty) return errors;
      !this.$v.pdfTempURL.required &&
        errors.push("El archivo adjunto es requerido");
      return errors;
    },
    contetErrors() {
      const errors = [];
      if (!this.$v.contenido.$dirty) return errors;
      !this.$v.contenido.required && errors.push("El contenido es requerido");
      return errors;
    },
    primeErrors() {
      const errors = [];
      if (!this.$v.prime.$dirty) return errors;
      !this.$v.prime.required && errors.push("Este campo es requerido");
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
    filesAd() {
      const reader = new FileReader();
      reader.readAsDataURL(this.filesAd);
      reader.onload = (e) => {
        this.pdfTempURL = e.target.result;
      };
      console.log(this.pdfTempURL);
    },
    listFile() {
      const reader = new FileReader();
      reader.readAsDataURL(this.listFile);
      reader.onload = (e) => {
        this.listFileTempUrl = e.target.result;
      };
      console.log(this.listFileTempUrl);
    },
  },
};
</script>