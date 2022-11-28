export default {
    setUsuario(state, payload) {
        state.usuarioLog = {...state.usuarioLog, ...payload}
        state.logIn = true;
        localStorage.setItem('usuario', JSON.stringify(payload))
    }
}