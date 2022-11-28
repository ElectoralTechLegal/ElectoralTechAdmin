import getters from "@/store/authModule/getters"
import mutations from "@/store/authModule/mutations"
import actions from "@/store/authModule/actions"

const state = {
    usuarioLog:{},
    logIn: false,
    logInError: '',
    ShowError: false
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}