<template>
  <div>
    <v-card :loading="loading">
      <v-card-title primary-title>
        <v-icon color="secondary" class="mr-2">
          mdi-format-list-bulleted-square</v-icon
        >
        Resumen
      </v-card-title>
      <v-tabs centered icons-and-text>
        <v-tab>
          <v-icon> mdi-account-search </v-icon>
          Usuarios registrados
        </v-tab>
        <v-tab>
          <v-icon> mdi-file-document-multiple-outline </v-icon>
          Formatos gratuitos generados
        </v-tab>
        <v-tab>
          <v-icon> mdi-file-document-multiple-outline </v-icon>
          Formatos de paga generados
        </v-tab>
        <v-tab>
          <v-icon> mdi-card-account-mail-outline </v-icon>
          Solicitudes de contacto
        </v-tab>
        <v-tab-item>
          <v-container fluid>
            <CustomTable
              :headers="headers"
              :data="elementos"
              :search="search"
              titulo="Búsqueda de usuarios"
            ></CustomTable>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid>
            <CustomTable
              :headers="headersF"
              :data="elementosF"
              :search="searchFormats"
              titulo="Búsqueda en formatos"
            ></CustomTable>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid>
            <FormatosPago/>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid>
            <CustomTable
              :headers="headersC"
              :data="elementosC"
              :search="searchContact"
              titulo="Búsqueda de solicitudes de contacto"
            ></CustomTable>
          </v-container>
        </v-tab-item>
      </v-tabs>

      <!-- <v-card-subtitle> Subtitulo </v-card-subtitle> -->
      <!--       <v-divider></v-divider>
      <v-card-text> </v-card-text> -->
    </v-card>
  </div>
</template>
<script>
// https://firebase.google.com/docs/rules
import { mapMutations, mapState } from "vuex";
import { fr, db, auth } from "../firebase";
import CustomTable from "../components/CustomTable";
import fn from "../lib/index";
import FormatosPago from "../components/FormatosPago";

export default {
  name: "Home",
  components: {
    CustomTable,
    FormatosPago
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setLoading(true);
        this.getFormatosFree()
        this.uid = user.uid;
        Promise.all([this.getUsuarios()]).then(() => {
          this.setLoading(false);
        });
        this.getContactRequest();
      } else {
        console.log("invalid user ", user);
        //store.dispatch('detectarUsuario', user)
      }
    });
    this.setBreadInit([
      { text: "Página de inicio", disabled: false, to: "home" },
    ]);
  },
  data() {
    return {
      uid: "",
      search: "",
      headers: [
        { text: "Nombre", align: "start", value: "nombre" },
        { text: "Apellidos", align: "start", value: "apellidos" },
        { text: "Correo", align: "start", value: "correo" },
        { text: "Fecha registro", align: "start", value: "fecha_registro" },
        { text: "Acciones", value: "actionsU", sortable: false },
      ],
      elementos: [],
      searchFormats: "",
      headersF: [
        { text: "Nombre", align: "start", value: "nombre" },
        { text: "Teléfono", align: "start", value: "telefono" },
        { text: "Correo", align: "start", value: "correo" },
        { text: "Estado", align: "start", value: "estado" },
        { text: "Fecha registro", align: "start", value: "fecha_registro" },
        { text: "Formato", align: "start", value: "formato" },
        { text: "Estatus", align: "start", value: "estatus" },
        // { text: "Acciones", value: "actions", sortable: false },
      ],
      elementosF: [],
      headersC: [
        { text: "Email", align: "start", value: "email" },
        { text: "Nombre", align: "start", value: "nombre" },
        { text: "Teléfono", align: "start", value: "telefono" },
        { text: "Comentario", align: "start", value: "comentario" },
        { text: "Preferencia Contacto", align: "start", value: "preferencia" },
        { text: "Fecha", align: "start", value: "fechaRegistro" },
      ],
      elementosC: [],
      searchContact: "",
    };
  },
  computed: {
    ...mapState("settingsModule", ["loading"]),
  },
  methods: {
    ...mapMutations({
      setLoading: "settingsModule/setLoading",
      setBreadInit: "settingsModule/setBreadInit"
    }),
    async getUsuarios() {
      try {
        console.log(this.uid);
        const usuarios = await fr.collection("usuarios").get();
        let docs = [];
        usuarios.forEach((doc) => {
          const fechaFormat = fn.fechaFormato(doc.data().fecha_registro);
          docs.push({ id: doc.id, ...doc.data(), fecha_registro: fechaFormat });
        });
        this.elementos = docs;
        console.log(docs);
      } catch (error) {
        console.log(error);
      }
    },
    async getFormatosFree() {
      try {
        let docs = [];
        fr.collection("formatosGeneral")
          .where("tipoFormato", "in", [1,2,3])
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                const fechaFormat = fn.fechaFormato(doc.data().fechaRegistro);
                const { usuarioInfo } = doc.data();
                const { estado } = usuarioInfo;
                docs.push({
                  uid: doc.id,
                  ...usuarioInfo,
                  estado: estado.estado,
                  fecha_registro: fechaFormat,
                  formato: doc.data().nombreFormato,
                  estatus: doc.data().estatus,
                });
              });
              this.elementosF = docs;
            } else {
              console.warn('Formatos free empty')
            }
            // console.log(docs);
          });
      } catch (error) {
        console.error(error);
      }
    },
    preferenciaContacto(tipo){
      switch (tipo) {
        case '1':
          return "Teléfono";
        case '2':
          return "Email";
        case '3':
          return "What's app";
      }
    },
    getContactRequest() {
      db.ref("/comentarios")
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((doc) => {
              this.elementosC.push({
                uid: doc.key,
                ...doc.val(),
                preferencia: this.preferenciaContacto(doc.val().preferencia),
                fechaRegistro: doc.val().fechaRegistro
                  ? fn.fechaFormato(doc.val().fechaRegistro)
                  : "",
              });
            });
          }
        });
    },
    getColor(estatus) {
      if (estatus == 1) return "red";
      else return "green";
    },
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
    },
    editItemF(format) {
      console.log(format);
    },
    deleteItemF(format) {
      console.log(format);
    },
  },
};
</script>