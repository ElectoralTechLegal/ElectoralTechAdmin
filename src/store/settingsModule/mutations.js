export default {
  setDrawerOpen: (state, data ) => state.drawerOpen = data,
  setDarkMode: (state, data) => state.darkMode = data,
  setLoading: (state, data) => state.loading = data,
  setTaskCompleted (state, data) {
    state.taskCompleted = true
    state.message = data.message
    state.color = data.color
  },
  setModal(state, data) {
    state.taskCompleted = data
  },
  setBreadInit (state, data) {
    state.breadItems = data
  },
  addBreadItem (state, data) {
    state.breadItems.push(data)
  }
}
