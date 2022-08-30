<template>
<div style="position: relative;width: 100%;height: 100%;">
  <auth v-if="user === null"></auth>
  <gismap v-if="user !== null"></gismap>
</div>
  
</template>

<script>

import auth from './components/auth'
import gismap from './components/map'

import store from './store'

export default {
  name: 'App',
  components: {
    auth,
    gismap,
  },
  computed: {
    user(){
      return store.getters.getUser
    }
  },
}
</script>

<style lang="scss">
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css");
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
  height: 70%;
}
.d-none{
  display: none;
}
.d-block{
  display: block !important;
}
.leaflet-top .leaflet-left{
  display: none;
}
.leaflet-top .leaflet-right{
  display: none;
}
@media(min-width: 768px) {
  .show{
    height: 100%;
  }
}
</style>
