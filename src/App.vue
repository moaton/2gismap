<template>
<div style="position: relative;width: 100%;height: 100%;">
  <div id="map" style="width:100%;height:100%;position: absolute;">
  </div>
  <showMore :dataTo="legalEntities" id="show-more" class="hide" @closebottommenu="isOpen=false"  />
</div>
  
</template>

<script>
const URL = 'http://195.49.212.34:8080' //'http://localhost:8080'
import showMore from './components/showMore'
import { ref } from 'vue'
export default {
  name: 'App',
  components: {
    showMore
  },
  async mounted() {
    
    await fetch(URL + '/api/uninhabited-premise').then(res => res.json()).then(data => console.log('uninhabited-premise = ', data))
    await fetch(URL + '/api/uninhabited-premise-two').then(res => res.json()).then(data => console.log('uninhabited-premise-two', data))
    await fetch(URL + '/api/cash-register-machine').then(res => res.json()).then(data => console.log('cash-register-machine',data))
    let DG = require('2gis-maps');
    let map = DG.map('map', {
        'center': [43.212534, 76.875994],
        'zoom': 16
    });
    map.on('click', (e) => {
      this.onClick(e)
    });
    // let latlngs = [[43.20802234781378, 76.8632698059082],[43.21721792338891, 76.87608003616334],[43.216694, 76.876611],[43.215427, 76.877056],[43.216201, 76.881316],[43.20664601994521, 76.87953472137453],[43.20417480788432, 76.86687469482423]];
    // DG.polygon(latlngs, {color: 'yellow'}).addTo(map);
    let taugul = [[43.216029,76.874610],[43.215689,76.875093],[43.215361,76.874632],[43.214939,76.874771],[43.210188,76.876397],[43.208276,76.877062],[43.208085,76.876016],[43.208101,76.875458],[43.207929,76.874583],[43.207991,76.873752],[43.208765,76.873505],[43.210337,76.870442],[43.212272,76.869621]]
    let taugul_1 = [[43.216029,76.874610],[43.215689,76.875093],[43.215361,76.874632],[43.214939,76.874771],[43.210204,76.876531],[43.211299,76.882732],[43.213715,76.881917],[43.216194,76.881348],[43.215451,76.877056],[43.216655,76.876595],[43.217093,76.876026]]
    let taugul_2 =[[43.210454,76.878247],[43.206576,76.879578],[43.207428,76.884127],[43.211252,76.882732]]
    DG.polygon(taugul, {color: 'blue'}).addTo(map);
    DG.polygon(taugul_1, {color: 'yellow'}).addTo(map);
    DG.polygon(taugul_2, {color: 'red'}).addTo(map);
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
  setup() {
    // const state = ref({
    //   dataTo: {},
    // })
    let legalEntities = ref({items: [], address: ''})
    let isOpen = ref(false)
    async function onClick(e){
      isOpen.value = false
      console.log(e, ' | ', e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
      await fetch(`${URL}/api/legal-entities?lat=${e.latlng.lat.toFixed(6)}&lon=${e.latlng.lng.toFixed(6)}`).then(res => res.json()).then(data => {
        legalEntities.value.items = []
        legalEntities.value.address = ''
        console.log('awaitfetch --> data', data)
        if(data.legalentities.length !== 0 || data.uninhabitedpremises.length !== 0){
          // console.log('awaitfetch --> item.address', item.address.toLowerCase().replace('мкр', '').split(/[,|-|.|-]/))
          // console.log('мкр ', item.address.toLowerCase().match(/таугуль[\s|-][\d|' '|'']|таугуль/))
          // console.log('дом ', item.address.toLowerCase().replace(' ', '').match(/д\.\d{1,5}[а-яё|,]/))
          if(data.legalentities.length !== 0){
            data.legalentities.map(legalItem => {
              legalEntities.value.items.push(
                {
                  address_name: legalItem.address,
                  name: legalItem.name,
                  id: legalItem.id,
                }
              ) 
            })
          }
          if(data.uninhabitedpremises.length !== 0){
            data.uninhabitedpremises.map(unhabitedItem => {
              legalEntities.value.items.push(
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
          }
          legalEntities.value.address = data.address
          console.log('awaitfetch --> legalEntities', legalEntities)
        } else {
          legalEntities.value.items.push({no_data: 'Нет данных', })
        }
        isOpen.value = true
    }).catch(() => {
      legalEntities.value.items = []
      legalEntities.value.address = ''
      legalEntities.value.items.push({no_data: 'Ошибка сервера', })
    })
      // var requestOptions = {
      //   method: 'GET',
      // };

      // await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&apiKey=71963a4211a24eb287b901ffa648bc58`, requestOptions)
      //   .then(response => response.json())
      //   .then(result => {
      //     console.log(result.features[0].properties.formatted)

          // if(result.features[0].properties){
          //   console.log(result.features[0].properties.formatted.match('/ТАУГУЛЬ 1, д.52,32/'));
          // }
          // fetch('http://localhost:3000/info').then((response) => {
          //   return response.json();
          // }).then((data) => {
          //   state.value.dataTo = data.find(el => result.features[0].properties.formatted.includes(el.address_name))
          //   if(state.value.dataTo){
          //     obj.value = {
          //       address_name: state.value.dataTo.address_name,
          //       full_name: state.value.dataTo.full_name,
          //       point: state.value.dataTo.point,
          //       id: state.value.dataTo.id
          //     }
          //     isOpen.value = true
          //   } else {
          //     let postObj = {
          //       full_name: result.features[0].properties.address_line2,
          //       address_name: result.features[0].properties.formatted.split(',').filter(el => !el.includes('Kazakhstan') && !el.includes('Almaty')).join(),
          //       point: {
          //         lat: e.latlng.lat, 
          //         lon: e.latlng.lng
          //       }
          //     }
          //     fetch('http://localhost:3000/info', {
          //       method: 'POST',
          //       body: JSON.stringify(postObj),
          //       headers: {
          //         'Content-Type': 'application/json'
          //       }
          //     }).then(() => {
          //       onClick(e)
          //     })
          //   }
            
          // });
      //   })
        // .catch(error => console.log('error', error));
    }
    return {
      onClick,
      legalEntities,
      isOpen,
    }
  }
}
</script>

<style lang="scss">
body{
  padding: 0;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
}
.hide{
  // bottom: -250px;
  height: 0;
}
.show{
  height: 45%;
}
.d-none{
  display: none;
}
.d-block{
  display: block !important;
}
@media(min-width: 768px) {
  .show{
    height: 100%;
  }
}
</style>
