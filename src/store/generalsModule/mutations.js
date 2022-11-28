export default {
    setDialogState(state, payload) {
        state.userDialogInfo = payload
    },
    setUsuarioConsulta(state, payload) {
        state.usuarioConsulta = payload;
    },
    setDialogPrimeState(state, payload) {
        state.userDialogPrime = payload
    },
    setUsuarioEditPrime(state, payload) {
        state.usuarioEditPrime = payload;
    },
    setDialogDetalleState(state, payload) {
        state.dialogDetalles = payload;
    },
    setDetalleData(state, payload) {
        state.detalleCompleto = payload;
    },
    setURLVoucher(state, payload) {
        state.urlVoucher = payload;
    },
    setVoucherDialog(state, payload) {
        state.voucherDialog = payload;
    },
    setCancelDialogModel(state, payload) {
        state.cancelDialogModel = payload;
    },
    setFinalizarDialog(state, payload) {
        state.finalizarDialogBand = payload;
    },
    setCancelDialogDet(state, payload) {
        state.detalleCancel = payload;
    },
    setAceptCancelDialog(state, payload) {
        state.aceptCancelBand = payload;
    },//destructuring
    setInfoCancelacion(state, {id, estatus}){
        state.idConsultaCancelacion = id;
        state.estatusCancelacion = estatus;
    },
}