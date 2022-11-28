import { fr } from '../../firebase';

export default {
    async verDetalle({ commit }, payload ) {
        console.info(payload);

        try {
            // this.setLoading(true)
            commit('settingsModule/setLoading', true, { root: true })
            
            const querySnapshot = await fr
                .collection("terceros")
                .doc(payload.terceroID)
                .get();
            const querySnapshotU = await fr
                .collection("usuarios")
                .doc(payload.usuarioRegistro)
                .get();
            if (querySnapshotU.exists) {
                this.usuarioDetalle = querySnapshotU.data();

                if ( querySnapshot.exists ){
                    this.detalle = querySnapshot.data();
                    commit('setDetalleData', {
                        cliente: this.usuarioDetalle,
                        responsable: this.detalle
                    });
                } else {
                    commit('setDetalleData', {
                        cliente: this.usuarioDetalle
                    });
                }

                commit('setDialogDetalleState', true)

            } else {
                console.log("no existe");
            }
            // this.setLoading(false);
            commit('settingsModule/setLoading', false, { root: true })
        } catch (error) {
            console.warn('verDetalle - ',error);
            commit('settingsModule/setTaskCompleted', {
                message: "Error, revisa tu conexión a internet",
                color: "error",
            }, { root: true })
        }
    },
}