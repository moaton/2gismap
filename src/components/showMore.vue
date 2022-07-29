<template>
  <div class="card" style="overflow: scroll;">
    <div class="d-flex justify-content-between p-3 mb-2" style="border-radius: 0.25rem;border-bottom: 1px solid;position: sticky;top: 0;left: 0;width: 100%;z-index: 5;background: #ececec;">
      <h4 class="m-0">{{dataTo.address.split(',').splice(0,2).join(',')}}</h4>
      <span @click="$emit('closebottommenu')" style="cursor: pointer;">X</span>
    </div>
    <div>
      <div v-if="dataTo.items.length === 0" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="spinner-border mb-3" role="status"></div>
        <h4>Загрузка данных...</h4>
      </div>
      <div v-for="data in dataTo.items" :key="data.id" v-else>
        <detailes :data="data"></detailes>
      </div>
    </div>
  </div>
</template>
<script>
import detailes from './detailes.vue';
// import { ref } from '@vue/reactivity'
export default {
  props: ['dataTo'],
  components: {
    detailes
  },
  setup() {
    return {
      
    }
  }
}
</script>
<style lang="scss">
  .card{
    position: absolute;
    z-index: 1000;
    height: 100%;
    width: 400px;
    border-radius: 10px;
    background: rgb(236, 236, 236);
    bottom: 0;
    left: 0;
    // width: 100%;
    transition: all .5s ease;
  }
  @media(max-width: 768px) {
    .card{
      width: 100%;
      height:250px
    }
  }
</style>