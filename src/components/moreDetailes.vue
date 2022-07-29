<template>
  <div>
    <div class="d-flex justify-content-end">
      <button class="btn" :class="btn === 'Подробонее...' ? 'btn-info' : 'btn-danger'" @click="moreDetailes(data)">{{btn}}</button>
    </div>
    <div v-if="isOpen && !data.hasOwnProperty('secondary_object_number')">
      <div class="mt-3">
        <p>Регистрационный номер: <b v-if="!isEdit">{{data.id}}</b><input v-else type="text" class="form-control" :placeholder="data.id"></p>
        <p>Наименование: <b v-if="!isEdit">{{data.name}}</b><input v-else type="text" class="form-control" :placeholder="data.name"></p>
        <p>Квартира: <b v-if="!isEdit">{{data.address_name.replace("кв.", "").split(',').reverse()[0]}}</b><input v-else type="text" class="form-control" :placeholder="data.address_name"></p>
      </div>
      <div v-if="isLoaded" class="mb-2">
        <div v-if="items.cashregistermachines.length !== 0 && items !== {} ">
          <p>ИИН/БИН: <b>{{items.cashregistermachines.business_id}}</b></p>
          <p>Режим налогообложения: <b>{{items.cashregistermachines.taxation_regime}}</b></p>
          <p>Марка ККМ с ФП: <b>{{items.cashregistermachines.brand_crm}}</b></p>
          <p>Заводской номер: <b>{{items.cashregistermachines.factory_number_crm}}</b></p>
          <p>Год выпуска: <b>{{items.cashregistermachines.year_release_crm}}</b></p>
          <p>Регистрационный номер: <b>{{items.cashregistermachines.registration_number_crm}}</b></p>
          <p>Дата постановки на учет: <b>{{items.cashregistermachines.date_registration_crm}}</b></p>
          <p>Дата снятия с учета: <b>{{items.cashregistermachines.date_de_registration_crm}}</b></p>
          <p>НО по месту регистрации ККМ с ФП: <b>{{items.cashregistermachines.place_registration_crm}}</b></p>
        </div>
        <div v-if="items.uninhabitedpremises.length !== 0 && items !== {} ">
          <p v-if="items.uninhabitedpremises.type_property">Вид объекта недвижимости: <b>{{items.uninhabitedpremises.type_property}}</b></p>
          <p v-if="items.uninhabitedpremises.real_estate_purpose">Целевое назначение недвижимости: <b>{{items.uninhabitedpremises.real_estate_purpose}}</b></p>
          <p v-if="items.uninhabitedpremises.total_area">Общая площадь: <b>{{items.uninhabitedpremises.total_area}} м<sup><small>2</small></sup></b></p>
          <p v-if="items.uninhabitedpremises.cadastral_number">Кадастровый номер объекта недвижимости: <b>{{items.uninhabitedpremises.cadastral_number}}</b></p>
          <p v-if="items.uninhabitedpremises.name_title_document">Наименование правоустанавливающего документа на недвижимое имущество: <b>{{items.uninhabitedpremises.name_title_document}}</b></p>
          <p v-if="items.uninhabitedpremises.date_title_document">Дата правоустанавливающего документа на недвижимое имущество: <b>{{items.uninhabitedpremises.date_title_document}}</b></p>
          <p v-if="items.uninhabitedpremises.number_title_document">Номер правоустанавливающего документа на недвижимое имущество: <b>{{items.uninhabitedpremises.number_title_document}}</b></p>
          <p v-if="items.uninhabitedpremises.date_registration">Дата регистрации права на недвижимое имущество: <b>{{items.uninhabitedpremises.date_registration}}</b></p>
          <p v-if="items.uninhabitedpremises.name_legal_entity">Наименование юридического лица или их структурных подразделений, крестьянских (фермерских) хозяйств: <b>{{items.uninhabitedpremises.name_legal_entity}}</b></p>
          <p v-if="items.uninhabitedpremises.transaction_amount">Сумма сделки: <b>{{items.uninhabitedpremises.transaction_amount}}</b></p>
          <p v-if="items.uninhabitedpremises.ownership">Собственность: <b>{{items.uninhabitedpremises.ownership}}</b></p>
          <p v-if="items.uninhabitedpremises.share_property">Доля в имуществе: <b>{{items.uninhabitedpremises.share_property}}</b></p>
        </div>
      </div>
    </div>
    <div v-if="isOpen && data.hasOwnProperty('secondary_object_number')" class="mt-3">
      <p v-if="!!data.secondary_object_number">Номер вторичного объекта: <b>{{data.secondary_object_number}}</b></p>
      <p v-if="!!data.admin_code">Код по классификатору административно – территориальных объектов: <b>{{data.admin_code}}</b></p>
      <p v-if="!!data.ownership">Право собственности на земельный участок: <b>{{data.ownership}}</b></p>
      <p v-if="!!data.share">Доля: <b>{{data.share}}</b></p>
      <p v-if="!!data.total_area">Площадь земельного участка: <b>{{data.total_area}} м<sup><small>2</small></sup></b></p>
      <p v-if="!!data.number_title_document">Номер правоустанавливающего документа на земельный участок: <b>{{data.number_title_document}}</b></p>
      <p v-if="!!data.name_title_document">Наименование правоустанавливающего документа на земельный участок: <b>{{data.name_title_document}}</b></p>
      <p v-if="!!data.date_title_document">Дата правоустанавливающего документа на земельный участок: <b>{{data.date_title_document}}</b></p>
      <p v-if="!!data.date_registration">Дата регистрации права на земельный участок: <b>{{data.date_registration}}</b></p>
      <p v-if="!!data.cadastral_number">Кадастровый номер земельного участка: <b>{{data.cadastral_number}}</b></p>
      <p v-if="!!data.real_estate_purpose">Целевое назначение земельного участка: <b>{{data.real_estate_purpose}}</b></p>
    </div>
    <div v-if="isOpen && user.role === 'admin'" class="actions mt-3 d-flex justify-content-end mb-3">
      <button class="btn btn-outline-primary" @click="edit()"><span v-if="isEdit">Сохранить</span><span v-else>Редактировать</span></button>
    </div>
  </div>
</template>
<script>
// const URL = 'http://195.49.212.34:8082'
const URL = 'http://localhost:8082'

import store from '../store'
import { ref } from '@vue/reactivity'
export default {
  props: ['data'],
  computed: {
    user(){
      return store.getters.getUser
    }
  },
  setup(props, {emit}) {
    let btn = ref('Подробонее...')
    let isLoaded = ref(false)
    let isOpen = ref(false)
    let items = ref({})
    let isEdit = ref(false)
    async function edit(){
      if(!isEdit.value){
        isEdit.value = true
        return
      }
    }
    async function moreDetailes(data){
      isLoaded.value = false
      if(btn.value === 'Подробонее...'){
        emit('onopen')
        isOpen.value = true
        if(data.secondary_object_number){
          isLoaded.value = true
          btn.value = 'Закрыть'
        } else {
          await fetch(`${URL}/api/legal-entities/${data.id}`).then(res => res.json()).then(res => {
            items.value = res
            isLoaded.value = true
            btn.value = 'Закрыть'
          })
        }
        return
      }
      btn.value = 'Подробонее...'
      isOpen.value = false
      isEdit.value = false
      emit('onopen')
    }
    return {
      moreDetailes,
      isLoaded,
      items,
      btn,
      isOpen,
      edit,
      isEdit
    }
  }
}
</script>
<style lang="scss" scoped>
p{
  margin: 0;
  position: relative;
}
p::before{
  content: "";
  position: absolute;
  bottom: 0;
  left: -4px;
  height: 0%;
  width: 2px;
  background: #2c3e50;
  transition: all .5s ease;
}
p::after{
  content: "";
  position: absolute;
  bottom: 0;
  left: -2px;
  height: 1px;
  width: 0%;
  background: #2c3e50;
  transition: all .5s ease;

}
p:hover::after{
  width: 100%;
}
p:hover::before{
  height: 100%;
}
</style>