<template>
  <div :style="isOpen ? 'background: #d9d9d9;' : 'background: #ececec;'" style="text-align: left;padding: 5px 15px;border-radius: 0.25rem;border-bottom: 1px solid;">
    <div v-if="data.no_data !== 'Нет данных' && data.no_data !== 'Ошибка сервера'">
      <div v-if="!data.hasOwnProperty('secondary_object_number')">
        <p class="text-right">Идентификатор: {{data.id}}</p>
        <h5>{{data.name}}</h5>
        <p>Адрес: {{data.address_name}}</p>
      </div>
      <div v-else>
        <p class="text-right">ИНН/БИН: {{data.business_id}}</p>
        <h5>{{data.full_name}}</h5>
        <p>Адрес: {{data.street_name}}, {{data.house_number}}</p>
      </div>
      <moreDetailes @onopen="onOpen" :data="data"></moreDetailes>
    </div>
    <div v-else style="text-align:center">
      <h3>{{data.no_data}}</h3>
    </div>
  </div>
</template>
<script>
import moreDetailes from './moreDetailes'
import { ref } from '@vue/reactivity'
export default {
  props: ['data'],
  components: {
    moreDetailes
  },
  setup() {
    let isOpen = ref(false)
    function onOpen(){
      isOpen.value = !isOpen.value
    }
    return {
      onOpen,
      isOpen
    }
  }
}
</script>
<style lang="scss">
</style>