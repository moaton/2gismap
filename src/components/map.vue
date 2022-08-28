<template>
  <div style="position: relative;width: 100%;height: 100%;overflow: hidden;">
    <div id="map" style="width:100%;height:100%;position: absolute;"></div>
    <showMore :dataTo="getLegalData" @reload="reload" @getitemscategory="getItemsCategory" :isloading="getLoadingState" id="show-more" class="hide" @closebottommenu="closeBottomMenu"  />
    <div class="user__added" :class="{'user__added-show': isUserAdded}">
      <p class="m-0">Пользователь добавлен</p>
    </div>
    <div class="add__user-btn" v-if="user.role === 'admin'">
      <button class="btn btn-warning" @click="addUser=!addUser">
        <i class="bi bi-person-plus-fill"></i>
      </button>
    </div>
    <div v-if="addUser" class="add__user-back">
      <div class="add__user">
        <auth :adduser="true" v-click-outside="closeAddUser" @close="closeAddUser" @authed="added"></auth>
      </div>
    </div>
  </div>
</template>

<script>
import auth from './auth.vue'
import showMore from './showMore.vue'
import { ref } from 'vue'
import store from '../store'

export default {
  components: {
    showMore,
    auth
  },
  async mounted() {
    if(store.state.user !== null){
      setTimeout(() => {
        this.loadMap()
      }, 500)
    }
  },
  watch: {
    isOpen() {
      if(!this.isOpen){
        let element = document.getElementById("show-more")
        element.classList.remove('show')
        setTimeout(async () => {
          element.classList.remove('d-block')
          element.classList.add('d-none')
        }, 600)
      } else {
        let element = document.getElementById("show-more")
        element.classList.remove('d-none')
        setTimeout(async () => {
          element.classList.add("d-block")
          setTimeout(async () => {
            element.classList.add("show")
          }, 650)
        }, 600)
      }
    }
  },
  computed: {
    getLegalData(){
      return store.getters.getLegalDate
    },
    getLoadingState(){
      return this.isLoading
    },
    user(){
      return store.getters.getUser
    },
  },
  setup() {
    // const state = ref({
    //   dataTo: {},
    // })
    let legalEntities = ref({items: [], address: ''})
    let isOpen = ref(false), isLoading = ref(false), addUser = ref(false)
    function closeBottomMenu(){
      isOpen.value = false
      store.commit('setCoordinates', {latlng: {lat: null, lng: null}})
    }
    function closeAddUser(){
      addUser.value = false
    }
    let isUserAdded = ref(false)
    function added(){
      isUserAdded.value = true
      addUser.value = false
      setTimeout(() => {
        isUserAdded.value = false
      }, 3000)
    }
    async function loadMap(){
      let DG = require('2gis-maps');
      let map = DG.map('map', {
          'center': [43.212534, 76.875994],
          'zoom': 16
      });
      map.on('click', (e) => {
        this.onClick(e)
      });
      let taugul = [[43.216029,76.874610],[43.215689,76.875093],[43.215361,76.874632],[43.214939,76.874771],[43.210188,76.876397],[43.208276,76.877062],[43.208085,76.876016],[43.208101,76.875458],[43.207929,76.874583],[43.207991,76.873752],[43.208765,76.873505],[43.210337,76.870442],[43.212272,76.869621]]
      let taugul_1 = [[43.216029,76.874610],[43.215689,76.875093],[43.215361,76.874632],[43.214939,76.874771],[43.210204,76.876531],[43.211299,76.882732],[43.213715,76.881917],[43.216194,76.881348],[43.215451,76.877056],[43.216655,76.876595],[43.217093,76.876026]]
      let taugul_2 =[[43.210454,76.878247],[43.206576,76.879578],[43.207428,76.884127],[43.211252,76.882732]]
      DG.polygon(taugul, {color: 'blue'}).addTo(map);
      DG.polygon(taugul_1, {color: 'yellow'}).addTo(map);
      DG.polygon(taugul_2, {color: 'red'}).addTo(map);
    }
    async function reload(payload){
      onClick(payload, true)
    }
    async function onClick(e, reload){
      store.commit('setIsRegistered', true)
      store.commit('setIsOwner', true)
      if(!reload){
        isOpen.value = false
      } else {
        isLoading.value = true
      }
      isOpen.value = await store.dispatch('getItems', e)
      if(isOpen.value){
        isLoading.value = false
      }
    }
    async function getItemsCategory(){
      isLoading.value = true
      if(store.getters.getIsRegistered === store.getters.getIsOwner){
        await store.dispatch('getItems', store.state.coordinates).then(() => isLoading.value = false)
        return
      }
      await store.dispatch('getItemsByCategory').then(() => isLoading.value = false)
    }
    return {
      onClick,
      loadMap,
      legalEntities,
      isOpen,
      closeBottomMenu,
      reload,
      closeAddUser,
      addUser,
      added,
      isUserAdded,
      getItemsCategory,
      isLoading,
    }
  }
}
</script>

<style>
  .add__user-back{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 22%);
    overflow: scroll;
    z-index: 1005;
  }
  .add__user{
    max-width: 485px; 
    margin: 0 auto;
  }
  .add__user .auth-card {
    background: #fff;
  }
  .add__user-btn{
    position: absolute; 
    top: 15%; 
    right: 10px;
  }
  .user__added {
    position: absolute;
    background: rgb(72, 179, 97);
    padding: 10px;
    border-radius: 0.25rem;
    color: rgb(255, 255, 255);
    width: 100%;
    top: -100%;
    transition: all .5s ease;
    z-index: 1010;
  }
  .user__added-show{
    top: 0;
  }
</style>