<template>
  <div>
    <v-dialog v-model="userDialogPrime" persistent max-width="350">
      <v-card max-width="375" class="mx-auto">
        <v-img :src="`${require('@/assets/perfil.jpg')}`" height="300px" dark>
          <v-row class="fill-height" align-content="center">
            <v-card-title class="white--text pt-12">
              <div class="title ml-5">{{ usuarioEditPrime.nombre }}</div>
              <div class="title ml-1">{{ usuarioEditPrime.apellidos }}</div>
            </v-card-title>
          </v-row>
        </v-img>
        <v-card-text>

            <v-text-field
            class="mt-3"
            disabled
            v-model="usuarioEditPrime.id"
            outlined
            label="Id Usuario"
            >
            </v-text-field>

            <v-select
            v-model="estadoUser"
            label="Estado Prime"
            outlined
            :items="primeOptions"
            item-text="text"
            item-value="value"
            >
            </v-select>

            <v-text-field v-if="estadoUser==1"
            class="form-control"
            label="Fecha de Termino Suscripcion"
            outlined
            type="date"
            v-model="fechaTermino"       
            >
            </v-text-field>
          



        </v-card-text>
        <v-card-actions center>
            <v-btn color="red" text @click="closeDialog">
                Cerrar
            </v-btn> 
             <v-spacer></v-spacer>
            <v-btn color="primary" text @click="actualizarPlan(usuarioEditPrime.id)">
                Actualizar
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { fr } from "../firebase";

export default {
  name: "UserInfoDialog",
  data () {
    return {
        primeOptions: [
            {
                value: "1", text: "Miembro Prime"
            },
            { 
                value: "0", text: "Miembro Gratuito"
            }
        ],
        estadoUser: [],
        fechaTermino: "",
    }
  },
  methods : {
    ...mapMutations({
      setDialogEdit : 'generalsModule/setDialogPrimeState'
    }),

    async actualizarPlan(id){
        //ACTUALIZAR AQUI EL VALOR EN FIREBASE
        const actualizarUser = await fr 
        .collection("usuarios")
        .doc(id)
        .update({
          SolicitudesPrime: 0,
          prime: 1,
        });
        const actualizarSuscripcion = await fr 
        .collection("suscripciones")
        .doc(id)
        .update({
          estado: 1
        });
        console.log(actualizarUser);
        console.log(actualizarSuscripcion);
      //AGREGAR ESTO AL .THEN
      this.setDialogEdit(false);
      window.location.reload();
    },
    closeDialog() {
      this.setDialogEdit(false);
    }
  },
  watch: {
      userDialogPrime(val){
          if(val==true){
              if(this.usuarioEditPrime.prime == 1){
                  this.estadoUser = {value: "1", text: "Miembro Prime"};
                    var time = new Date(this.usuarioEditPrime.fecha_fin_prime);
                    var theyear = time.getFullYear();
                    var themonth = time.getMonth() + 1;
                    var thetoday = time.getDate();
                    if(themonth<10){
                        this.fechaTermino = theyear +"-0"+themonth+"-"+thetoday;
                    }else{
                        this.fechaTermino = theyear +"-"+themonth+"-"+thetoday;
                    }          
                  console.log(this.fechaTermino);
              } else {
                  this.estadoUser = {value: "0", text: "Miembro Gratuito"};
              }
              console.log("opened edit");
          }
      }
  },
  computed : {
    ...mapState('generalsModule', ['userDialogPrime', 'usuarioEditPrime'])
  },
  
}
</script>