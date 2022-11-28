import mutations from './mutations'
import actions from './actions'

const state = {
    userDialogInfo: false,
    usuarioConsulta: {},
    dialogDetalles: false,
    detalleCompleto: {},
    voucherDialog: false,
    fechaVocher: '',
    urlVoucher: '',
    cancelDialogModel: false,
    finalizarDialogBand: false,
    detalleCancel: false,
    aceptCancelBand: false,
    idConsultaCancelacion: '',
    estatusCancelacion: '',
    userDialogPrime: false,
    usuarioEditPrime: {},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}