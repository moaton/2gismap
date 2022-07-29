import { createStore } from 'vuex'
// const URL = 'http://195.49.212.34:8082' 
const URL = 'http://localhost:8082'
export default createStore({
  state: {
    user: null,
    existUser: false,
    incorrect: false,
  },
  actions: {
    async auth({commit}, payload){
      const response = await fetch(`${URL}/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload.params) 
      })
      let res = await response.json()
      if(res.message === 'the user has been created'){
        commit('setExistUserStatus', true)
      } else if(res.message === 'the password is not correct'){
        commit('setIncorrectStatus', true)
      } else {
        commit('setExistUserStatus', false)
        commit('setIncorrectStatus', false)
        commit('setUser', res.user)
      }
      return 'success'
    }
  },
  mutations: {
    setExistUserStatus(state, payload){
      state.existUser = payload
    },
    setIncorrectStatus(state, payload){
      state.incorrect = payload
    },
    setUser(state, payload){
      state.user = payload
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getExistUserStatus: state => {
      return state.existUser
    },
    getIncorrectStatus: state => {
      return state.incorrect
    },
  },
  modules: {
  }
})
