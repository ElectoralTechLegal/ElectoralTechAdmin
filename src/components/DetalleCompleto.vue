<template>
  <div>
    <v-dialog
      v-model="dialogDetalles"
      persistent
      max-width="350px"
      v-if="dialogDetalles"
    >
      <v-card>
        <v-card-title> Detalle del caso </v-card-title>

        <v-card-text>
          <v-container>
            <div v-if="responsable">
              <v-list nav dense>
                <v-subheader>Información del responsable </v-subheader>
                <v-list-item-group v-model="selectedItem" color="primary">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-information-outline</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ responsable.nombre }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-information-outline</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ responsable.descripcion }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-map-marker</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ responsable.direccion }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-card-account-phone</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ responsable.telefono }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-at</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ responsable.correo }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <hr />
            </div>
            <v-list nav dense>
              <v-subheader>Información del cliente </v-subheader>
              <v-list-item-group v-model="selectedUserItem" color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-outline</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ cliente.nombre }} {{ cliente.apellidos }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-card-account-phone</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ cliente.telefono }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-at</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ cliente.correo ? cliente.correo : "-" }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="aceptar"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "DetalleCompleto",
  mounted() {},
  data() {
    return {
      selectedItem: "",
      selectedUserItem: "",
    };
  },
  methods: {
    ...mapMutations({
      setDialogDetalleState: "generalsModule/setDialogDetalleState",
    }),
    aceptar() {
      this.setDialogDetalleState(false);
    },
  },
  computed: {
    ...mapState("generalsModule", ["dialogDetalles", "detalleCompleto"]),
    responsable() {
      return this.detalleCompleto.responsable
        ? this.detalleCompleto.responsable
        : null;
    },
    cliente() {
      return this.detalleCompleto.cliente;
    },
  },
};
</script>