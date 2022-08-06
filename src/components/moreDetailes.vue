<template>
  <div>
    <div class="d-flex justify-content-end">
      <button class="btn" :class="btn === 'Подробонее...' ? 'btn-info' : 'btn-secondary'" @click="moreDetailes(data)">{{btn}}</button>
    </div>
    <div v-if="isOpen && !data.hasOwnProperty('secondary_object_number')">
      <div class="mt-3">
        <p>Регистрационный номер: <b>{{data.id}}</b></p>
        <p>Наименование: <b v-if="!isEdit">{{data.name}}</b><input v-else v-model="legalEntityForm.name" type="text" class="form-control" :placeholder="data.name"></p>
        <p>Квартира: <b v-if="!isEdit">{{getAddress(data.address_name)}}</b><input v-else v-model="legalEntityForm.address" type="text" class="form-control" :placeholder="data.address_name.replace('кв.', '').split(',').reverse()[0]"></p>
      </div>
      <div v-if="isLoaded" class="mb-2"> <!-- РЕДАКТИРОВАНИЕ ДОПИЛИТЬ, ОТПРАВКА ДАННЫХ НА БЭК И СЭЙВ В БД -->
        <div v-if="items.cashregistermachines.length !== 0 && items !== {} ">
          <p v-if="items.cashregistermachines.business_id !== ''">ИИН/БИН: <b v-if="!isEdit">{{items.cashregistermachines.business_id}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.business_id"></p>
          <p v-if="items.cashregistermachines.taxation_regime !== ''">Режим налогообложения: <b v-if="!isEdit">{{items.cashregistermachines.taxation_regime}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.taxation_regime"></p>
          <p v-if="items.cashregistermachines.brand_crm !== ''">Марка ККМ с ФП: <b v-if="!isEdit">{{items.cashregistermachines.brand_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.brand_crm"></p>
          <p v-if="items.cashregistermachines.factory_number_crm !== ''">Заводской номер: <b v-if="!isEdit">{{items.cashregistermachines.factory_number_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.factory_number_crm"></p>
          <p v-if="items.cashregistermachines.year_release_crm !== ''">Год выпуска: <b v-if="!isEdit">{{items.cashregistermachines.year_release_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.year_release_crm"></p>
          <p v-if="items.cashregistermachines.registration_number_crm !== ''">Регистрационный номер: <b v-if="!isEdit">{{items.cashregistermachines.registration_number_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.registration_number_crm"></p>
          <p v-if="items.cashregistermachines.date_registration_crm !== ''">Дата постановки на учет: <b v-if="!isEdit">{{items.cashregistermachines.date_registration_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.date_registration_crm"></p>
          <p v-if="items.cashregistermachines.date_de_registration_crm !== ''">Дата снятия с учета: <b v-if="!isEdit">{{items.cashregistermachines.date_de_registration_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.date_de_registration_crm"></p>
          <p v-if="items.cashregistermachines.place_registration_crm !== ''">НО по месту регистрации ККМ с ФП: <b v-if="!isEdit">{{items.cashregistermachines.place_registration_crm}}</b><input v-else type="text" class="form-control" :placeholder="items.cashregistermachines.place_registration_crm"></p>
        </div>
        <div v-if="items.uninhabitedpremises.length !== 0 && items !== {} ">
          <p v-if="items.uninhabitedpremises.type_property">Вид объекта недвижимости: <b v-if="!isEdit">{{items.uninhabitedpremises.type_property}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.type_property"></p>
          <p v-if="items.uninhabitedpremises.real_estate_purpose">Целевое назначение недвижимости: <b v-if="!isEdit">{{items.uninhabitedpremises.real_estate_purpose}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.real_estate_purpose"></p>
          <p v-if="items.uninhabitedpremises.total_area">Общая площадь: <b v-if="!isEdit">{{items.uninhabitedpremises.total_area}} м<sup><small>2</small></sup></b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.total_area"></p>
          <p v-if="items.uninhabitedpremises.cadastral_number">Кадастровый номер объекта недвижимости: <b v-if="!isEdit">{{items.uninhabitedpremises.cadastral_number}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.cadastral_number"></p>
          <p v-if="items.uninhabitedpremises.name_title_document">Наименование правоустанавливающего документа на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.name_title_document}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.name_title_document"></p>
          <p v-if="items.uninhabitedpremises.date_title_document">Дата правоустанавливающего документа на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.date_title_document}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.date_title_document"></p>
          <p v-if="items.uninhabitedpremises.number_title_document">Номер правоустанавливающего документа на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.number_title_document}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.number_title_document"></p>
          <p v-if="items.uninhabitedpremises.date_registration">Дата регистрации права на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.date_registration}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.date_registration"></p>
          <p v-if="items.uninhabitedpremises.name_legal_entity">Наименование юридического лица или их структурных подразделений, крестьянских (фермерских) хозяйств: <b v-if="!isEdit">{{items.uninhabitedpremises.name_legal_entity}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.name_legal_entity"></p>
          <p v-if="items.uninhabitedpremises.transaction_amount">Сумма сделки: <b v-if="!isEdit">{{items.uninhabitedpremises.transaction_amount}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.transaction_amount"></p>
          <p v-if="items.uninhabitedpremises.ownership">Собственность: <b v-if="!isEdit">{{items.uninhabitedpremises.ownership}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.ownership"></p>
          <p v-if="items.uninhabitedpremises.share_property">Доля в имуществе: <b v-if="!isEdit">{{items.uninhabitedpremises.share_property}}</b><input v-else type="text" class="form-control" :placeholder="items.uninhabitedpremises.share_property"></p>
        </div>
      </div>
    </div>
    <div v-if="isOpen && data.hasOwnProperty('secondary_object_number')" class="mt-3">
      <p v-if="!!data.secondary_object_number">Номер вторичного объекта: <b v-if="!isEdit">{{data.secondary_object_number}}</b><input v-else type="text" class="form-control" :placeholder="data.secondary_object_number"></p>
      <p v-if="!!data.admin_code">Код по классификатору административно – территориальных объектов: <b v-if="!isEdit">{{data.admin_code}}</b><input v-else type="text" class="form-control" :placeholder="data.admin_code"></p>
      <p v-if="!!data.ownership">Право собственности на земельный участок: <b v-if="!isEdit">{{data.ownership}}</b><input v-else type="text" class="form-control" :placeholder="data.ownership"></p>
      <p v-if="!!data.share">Доля: <b v-if="!isEdit">{{data.share}}</b><input v-else type="text" class="form-control" :placeholder="data.share"></p>
      <p v-if="!!data.total_area">Площадь земельного участка: <b v-if="!isEdit">{{data.total_area}} м<sup><small>2</small></sup></b><input v-else type="text" class="form-control" :placeholder="data.total_area"></p>
      <p v-if="!!data.number_title_document">Номер правоустанавливающего документа на земельный участок: <b v-if="!isEdit">{{data.number_title_document}}</b><input v-else type="text" class="form-control" :placeholder="data.number_title_document"></p>
      <p v-if="!!data.name_title_document">Наименование правоустанавливающего документа на земельный участок: <b v-if="!isEdit">{{data.name_title_document}}</b><input v-else type="text" class="form-control" :placeholder="data.name_title_document"></p>
      <p v-if="!!data.date_title_document">Дата правоустанавливающего документа на земельный участок: <b v-if="!isEdit">{{data.date_title_document}}</b><input v-else type="text" class="form-control" :placeholder="data.date_title_document"></p>
      <p v-if="!!data.date_registration">Дата регистрации права на земельный участок: <b v-if="!isEdit">{{data.date_registration}}</b><input v-else type="text" class="form-control" :placeholder="data.date_registration"></p>
      <p v-if="!!data.cadastral_number">Кадастровый номер земельного участка: <b v-if="!isEdit">{{data.cadastral_number}}</b><input v-else type="text" class="form-control" :placeholder="data.cadastral_number"></p>
      <p v-if="!!data.real_estate_purpose">Целевое назначение земельного участка: <b v-if="!isEdit">{{data.real_estate_purpose}}</b><input v-else type="text" class="form-control" :placeholder="data.real_estate_purpose"></p>
    </div>
    <div v-if="isOpen && user.role === 'admin'" class="actions mt-3 d-flex justify-content-between mb-3">
      <button class="btn btn-outline-danger" @click="deleteItem()">Удалить</button>
      <button class="btn btn-primary" @click="editItem()"><span v-if="isEdit">Сохранить</span><span v-else>Редактировать</span></button>
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
    },
  },
  setup(props, {emit}) {
    let btn = ref('Подробонее...')
    let isLoaded = ref(false)
    let isOpen = ref(false)
    let items = ref({})
    let isEdit = ref(false)

    let legalEntityForm = ref({
      name: '',
      address: ''
    })
    function getAddress(address){
      return address.replace("кв.", "").split(',').reverse()[0]
    }
    async function deleteItem(){
      await store.dispatch('deleteItem', {url: 'legal-entities', id: props.data.id}).then(() => {
        legalEntityForm.value = {
          name: '',
          address: ''
        }
        isEdit.value = false
      })
    }
    async function editItem(){
      if(!isEdit.value){
        isEdit.value = true
        return
      } else {
        let isLegalEdit = false, params = {}
        for(let key in legalEntityForm.value){
          if(legalEntityForm.value[key] !== '' && key !== 'id'){
            isLegalEdit = true
            if(key === 'address'){
              params.address = props.data.address_name.split(',').splice(0, props.data.address_name.split(',').length-1).join(',') + ',' + props.data.address_name.split(',').splice(props.data.address_name.split(',').length-1, props.data.address_name.split(',').length)[0].replace(props.data.address_name.replace("кв.", "").split(',').reverse()[0].replace(' ', ''),legalEntityForm.value.address)
            } else {
              params[key] = legalEntityForm.value[key]
            }
          }
        }
        if(isLegalEdit){
          await store.dispatch('editItem', {url: 'legal-entities', params, id: props.data.id}).then(() => {
            legalEntityForm.value = {
              name: '',
              address: ''
            }
            isEdit.value = false
          })
          // if(res === 'success'){
          //   emit('updatedata', legalEntityForm.value)
          // }
        } else {
          isEdit.value = false
        }
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
          await fetch(`${URL}/api/legal-entities/${data.id}?ismore=true`).then(res => res.json()).then(res => {
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
      editItem,
      isEdit,
      legalEntityForm,
      getAddress,
      deleteItem
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