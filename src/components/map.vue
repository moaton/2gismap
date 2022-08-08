<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <div id="map" style="width:100%;height:100%;position: absolute;"></div>
    <showMore :dataTo="getLegalData" id="show-more" class="hide" @closebottommenu="closeBottomMenu"  />
  </div>
</template>

<script>
import showMore from './showMore.vue'
import { ref } from 'vue'
import store from '../store'

export default {
  components: {
    showMore
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
    }
  },
  setup() {
    // const state = ref({
    //   dataTo: {},
    // })
    let legalEntities = ref({items: [], address: ''})
    let isOpen = ref(false)
    function closeBottomMenu(){
      isOpen.value = false
      store.commit('setCoordinates', {latlng: {lat: null, lng: null}})
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
    async function onClick(e){
      isOpen.value = false
      isOpen.value = await store.dispatch('getItems', e)
    }
    return {
      onClick,
      loadMap,
      legalEntities,
      isOpen,
      closeBottomMenu
    }
  }
}
</script>

<style>

</style>