<template>
  <div>
    <v-dialog v-model="voucherDialog" max-width="400px" persistent>
      <v-card>
        <v-img :src="urlVoucher" class="grey darken-4">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-card-title class="title"> Comprobante de pago </v-card-title>
        <v-card-subtitle>
          Fecha registro {{ fechaVocher }}
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="setVoucherDialog(false)">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'VocherDialog',
  data () {
    return {}
  },
  methods: {
    ...mapMutations({
      setVoucherDialog: 'generalsModule/setVoucherDialog'
    })
  },
  computed: {
    ...mapState('generalsModule', ['voucherDialog','urlVoucher', 'fechaVocher']),
  }
}
</script>