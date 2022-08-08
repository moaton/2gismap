import { createStore } from 'vuex'
const URL = 'http://195.49.212.34:8082' 
// const URL = 'http://localhost:8082'
export default createStore({
  state: {
    user: null,
    existUser: false,
    incorrect: false,
    legalEntities: {
      items: [], 
      address: ''
    },
    coordinates: {
      latlng: {
        lat: null,
        lng: null
      }
    }
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
    },
    async addItem({commit}, payload){
      const response = await fetch(`${URL}${payload.url}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload.items) 
      })
      let res = await response.json()
      console.log(res);
    },
    async editItem({state, commit,dispatch}, payload){
      let suburl = payload.url
      const response = await fetch(`${URL}/api/${suburl}/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload.params) 
      })
      // if(response.status.toString()[0] === '2' && suburl == 'legal-entities'){
      //   dispatch('getItem',{id: payload.id, coord: state.coordinates})
      // }
      return 'success'
    },
    async deleteItem({commit}, payload){
      console.log(payload.id);
    },
    async getItem({commit}, payload){
      let res = await fetch(`${URL}/api/legal-entities/${payload.id}`) //?lat=${e.latlng.lat.toFixed(6)}&lon=${e.latlng.lng.toFixed(6)}`)
      if(res.status.toString()[0] === '2'){
        let item = await res.json()
        commit('setItem', item)
      }
    },
    async getItems({commit}, e){
      try {
        commit('setCoordinates', {latlng: {lat: e.latlng.lat, lng: e.latlng.lng}})
        let res = await fetch(`${URL}/api/legal-entities?lat=${e.latlng.lat.toFixed(6)}&lon=${e.latlng.lng.toFixed(6)}`)
      
        if(res.status.toString()[0] === '2'){
          let data = await res.json()
          commit('setNullData')
          if(data.legalentities.length !== 0 || data.uninhabitedpremises.length !== 0){
            if(data.legalentities.length !== 0){
              commit('setLegalEntities', data.legalentities)
            }
            if(data.uninhabitedpremises.length !== 0){
              commit('setUnInhabettedData', data.uninhabitedpremises)
            }
            commit('setAddress', data.address)
          } else {
            commit('setErrorData', {no_data: 'Нет данных', })
          }
        }
        return true
      } catch (err) {
        console.log('getItems --> err', err)
        commit('setNullData')
        commit('setErrorData', {no_data: 'Ошибка сервера', })
        return true
      }
    }
  },
  mutations: {
    setItem(state, payload){
      let index = state.legalEntities.items.findIndex(item => item.id === payload.id)
      if(index !== -1){
        state.legalEntities.items[index] = {
          address_name: payload.address,
          name: payload.name,
          id: payload.id,
        }
      }
    },
    setCoordinates(state, payload){
      state.coordinates = payload
    },
    setAddress(state, payload){
      state.legalEntities.address = payload
    },
    setUnInhabettedData(state, payload){
      payload.map(unhabitedItem => {
        state.legalEntities.items.push(
          {
            admin_code: unhabitedItem.admin_code,
            business_id: unhabitedItem.business_id,
            cadastral_number: unhabitedItem.cadastral_number,
            date_registration: unhabitedItem.date_registration,
            date_title_document: unhabitedItem.date_title_document,
            house_number: unhabitedItem.house_number,
            full_name: unhabitedItem.full_name,
            name_locality: unhabitedItem.name_locality,
            name_title_document: unhabitedItem.name_title_document,
            number_title_document: unhabitedItem.number_title_document,
            ownership: unhabitedItem.ownership,
            real_estate_purpose: unhabitedItem.real_estate_purpose,
            secondary_object_number: unhabitedItem.secondary_object_number,
            share: unhabitedItem.share,
            street_name: unhabitedItem.street_name,
            total_area: unhabitedItem.total_area,
          }
        ) 
      })
    },
    setLegalEntities(state, payload){
      payload.map(legalItem => {
        state.legalEntities.items.push(
          {
            address_name: legalItem.address,
            name: legalItem.name,
            id: legalItem.id,
          }
        ) 
      })
    },
    setErrorData(state, payload){
      state.legalEntities.items.push(payload)
    },
    setNullData(state){
      state.legalEntities.items = []
      state.legalEntities.address = ''
    },
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
    getLegalDate: state => {
      return state.legalEntities
    },
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
