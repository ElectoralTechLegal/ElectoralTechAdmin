<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="titulo"
          single-line
          color="accent"
          filled
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="data"
      :search="search"
    >

        <template v-slot:[`item.actionsU`]="{ item }">
          <v-icon
          
          color="red"
          small
          v-if="item.SolicitudesPrime == 1"
          >
              mdi-alert-circle
          </v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon 
              small 
              class="mr-2"  
              v-bind="attrs"
              v-on="on"
              @click="printUserData(item)"
              >
                mdi-account-search
              </v-icon>
            </template>
            <span>Detalles del usuario</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon 
              small
              v-bind="attrs"
              v-on="on"
              @click="editUserPrime(item)"
              >
                mdi-credit-card-refresh
              </v-icon>
            </template>
            <span>Editar Plan</span>
          </v-tooltip>
        </template>
      <!--
       <template v-slot:[`item.estatus`]="{ item }">
        <v-chip :color="getColor(item.calories)" dark>
          {{ item.estatus }}
        </v-chip>
      </template> -->
    </v-data-table>
    <user-info-dialog/>
    <user-prime-dialog/>
  </div>
</template>
<script>

import { mapMutations } from "vuex";
import UserInfoDialog from "../components/UserInfoDialog";
import UserPrimeDialog from "../components/UserPrimeDialog";

export default {
  name: 'CustomTable',
  components: {
    UserInfoDialog,
    UserPrimeDialog,
  },
  props: ['headers', 'data', 'search', 'titulo'],
  data () {
    return {

    }
  },
  methods:{
     ...mapMutations({
      setDialog: "generalsModule/setDialogState",
      setUsuarioConsulta: "generalsModule/setUsuarioConsulta",
      setDialogEdit: "generalsModule/setDialogPrimeState",
      setUsuarioEditPrime: "generalsModule/setUsuarioEditPrime"
    }),
    printUserData(item){
      this.setUsuarioConsulta(item)
      this.setDialog(true);
    },
    editUserPrime(item){
      this.setUsuarioEditPrime(item)
      this.setDialogEdit(true);
    },
    showItem(item){
      console.log(item);
    }


  }
};
</script>