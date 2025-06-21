import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      currentUser: null
    },
    asset: {
      bienes: [
        { id: 1, nombre: 'Laptop HP', categoria: 'Equipos de Cómputo', estado: 'Buen Estado', valor: 1200, responsableId: 2 },
        { id: 2, nombre: 'Proyector Epson', categoria: 'Equipos de Oficina', estado: 'En Reparación', valor: 800, responsableId: 1 },
        { id: 3, nombre: 'Silla Ergonómica', categoria: 'Mobiliario', estado: 'Buen Estado', valor: 150, responsableId: 2 }
      ]
    }
  },
  getters: {
    isAuthenticated: () => !!localStorage.getItem('auth_token'),
    currentUser: state => state.user.currentUser
  },
  mutations: {
    setUser(state, user) {
      state.user.currentUser = user;
    },
    logout(state) {
      state.user.currentUser = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  modules: {
  }
})
