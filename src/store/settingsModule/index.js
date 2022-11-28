import mutations from './mutations'
import getters from './getters'

const state = {
  drawerOpen: null,
  darkMode: false,
  loading: false,
  message: '',
  taskCompleted: false,
  color: 'success',
  breadItems: []
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}