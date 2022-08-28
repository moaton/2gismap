<template>
  <div>
    <div class="d-flex justify-content-end">
      <button class="btn" :class="btn === 'Подробнее...' ? 'btn-info' : 'btn-secondary'" @click="moreDetailes(data)">{{btn}}</button>
    </div>
    <div v-if="isOpen" class="d-flex align-items-center justify-content-center pb-4 mb-2 pt-2" style="border-bottom: 1px solid; background: rgb(217, 217, 217);">
      <p class="link-btn m-0 mr-2" :class="{'link-btn-active': isInformation}" @click="selectSubCategory('info')" v-if="user.role === 'admin' || user.role === 'employee_reg' || user.role === 'moderator_reg'">Информация</p>
      <p class="link-btn m-0" :class="{'link-btn-active': isRevenue}" @click="selectSubCategory('revenue')" v-if="user.role === 'admin' || user.role === 'revenue-employee_owners' || user.role === 'moderator_owners' || user.role === 'revenue-employee_reg'">Доходы</p>
    </div>
    <div v-if="isInformation">
      <div v-if="isOpen && !data.hasOwnProperty('secondary_object_number')">
        <div class="mt-3">
          <p>Регистрационный номер: <b>{{data.id}}</b></p>
          <p>Наименование: <b v-if="!isEdit">{{data.name}}</b><input v-else v-model="editForm.name" type="text" class="form-control" :placeholder="data.name"></p>
          <p>Квартира: <b v-if="!isEdit">{{getAddress(data.address_name)}}</b><input v-else v-model="editForm.apartment" type="text" class="form-control" :placeholder="data.address_name.replace('кв.', '').split(',').reverse()[0]"></p>
        </div>
        <div v-if="isLoaded" class="mb-2"> <!-- РЕДАКТИРОВАНИЕ ДОПИЛИТЬ, ОТПРАВКА ДАННЫХ НА БЭК И СЭЙВ В БД -->
          <div v-if="items.cashregistermachines.length !== 0 && items !== {} ">
            <p v-if="items.cashregistermachines.business_id !== ''">ИИН/БИН: <b v-if="!isEdit">{{items.cashregistermachines.business_id}}</b><input v-else v-model="editForm.business_id" type="text" class="form-control" :placeholder="items.cashregistermachines.business_id"></p>
            <p v-if="items.cashregistermachines.taxation_regime !== ''">Режим налогообложения: <b v-if="!isEdit">{{items.cashregistermachines.taxation_regime}}</b><input v-else v-model="editForm.taxation_regime" type="text" class="form-control" :placeholder="items.cashregistermachines.taxation_regime"></p>
            <p v-if="items.cashregistermachines.brand_crm !== ''">Марка ККМ с ФП: <b v-if="!isEdit">{{items.cashregistermachines.brand_crm}}</b><input v-else v-model="editForm.brand_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.brand_crm"></p>
            <p v-if="items.cashregistermachines.factory_number_crm !== ''">Заводской номер: <b v-if="!isEdit">{{items.cashregistermachines.factory_number_crm}}</b><input v-else v-model="editForm.factory_number_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.factory_number_crm"></p>
            <p v-if="items.cashregistermachines.year_release_crm !== ''">Год выпуска: <b v-if="!isEdit">{{items.cashregistermachines.year_release_crm}}</b><input v-else v-model="editForm.year_release_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.year_release_crm"></p>
            <p v-if="items.cashregistermachines.registration_number_crm !== ''">Регистрационный номер: <b v-if="!isEdit">{{items.cashregistermachines.registration_number_crm}}</b><input v-else v-model="editForm.registration_number_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.registration_number_crm"></p>
            <p v-if="items.cashregistermachines.date_registration_crm !== ''">Дата постановки на учет: <b v-if="!isEdit">{{items.cashregistermachines.date_registration_crm}}</b><input v-else v-model="editForm.date_registration_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.date_registration_crm"></p>
            <p v-if="items.cashregistermachines.date_de_registration_crm !== ''">Дата снятия с учета: <b v-if="!isEdit">{{items.cashregistermachines.date_de_registration_crm}}</b><input v-else v-model="editForm.date_de_registration_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.date_de_registration_crm"></p>
            <p v-if="items.cashregistermachines.place_registration_crm !== ''">НО по месту регистрации ККМ с ФП: <b v-if="!isEdit">{{items.cashregistermachines.place_registration_crm}}</b><input v-else v-model="editForm.place_registration_crm" type="text" class="form-control" :placeholder="items.cashregistermachines.place_registration_crm"></p>
          </div>
          <div v-if="items.uninhabitedpremises.length !== 0 && items !== {} ">
            <p v-if="items.uninhabitedpremises.type_property">Вид объекта недвижимости: <b v-if="!isEdit">{{items.uninhabitedpremises.type_property}}</b><input v-else v-model="editForm.type_property" type="text" class="form-control" :placeholder="items.uninhabitedpremises.type_property"></p>
            <p v-if="items.uninhabitedpremises.real_estate_purpose">Целевое назначение недвижимости: <b v-if="!isEdit">{{items.uninhabitedpremises.real_estate_purpose}}</b><input v-else v-model="editForm.real_estate_purpose" type="text" class="form-control" :placeholder="items.uninhabitedpremises.real_estate_purpose"></p>
            <p v-if="items.uninhabitedpremises.total_area">Общая площадь: <b v-if="!isEdit">{{items.uninhabitedpremises.total_area}} м<sup><small>2</small></sup></b><input v-else v-model="editForm.total_area" type="text" class="form-control" :placeholder="items.uninhabitedpremises.total_area"></p>
            <p v-if="items.uninhabitedpremises.cadastral_number">Кадастровый номер объекта недвижимости: <b v-if="!isEdit">{{items.uninhabitedpremises.cadastral_number}}</b><input v-else v-model="editForm.cadastral_number" type="text" class="form-control" :placeholder="items.uninhabitedpremises.cadastral_number"></p>
            <p v-if="items.uninhabitedpremises.name_title_document">Наименование правоустанавливающего документа на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.name_title_document}}</b><input v-else v-model="editForm.name_title_document" type="text" class="form-control" :placeholder="items.uninhabitedpremises.name_title_document"></p>
            <p v-if="items.uninhabitedpremises.date_title_document">Дата правоустанавливающего документа на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.date_title_document}}</b><input v-else v-model="editForm.date_title_document" type="text" class="form-control" :placeholder="items.uninhabitedpremises.date_title_document"></p>
            <p v-if="items.uninhabitedpremises.number_title_document">Номер правоустанавливающего документа на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.number_title_document}}</b><input v-else v-model="editForm.number_title_document" type="text" class="form-control" :placeholder="items.uninhabitedpremises.number_title_document"></p>
            <p v-if="items.uninhabitedpremises.date_registration">Дата регистрации права на недвижимое имущество: <b v-if="!isEdit">{{items.uninhabitedpremises.date_registration}}</b><input v-else v-model="editForm.date_registration" type="text" class="form-control" :placeholder="items.uninhabitedpremises.date_registration"></p>
            <p v-if="items.uninhabitedpremises.name_legal_entity">Наименование юридического лица или их структурных подразделений, крестьянских (фермерских) хозяйств: <b v-if="!isEdit">{{items.uninhabitedpremises.name_legal_entity}}</b><input v-else v-model="editForm.name_legal_entity" type="text" class="form-control" :placeholder="items.uninhabitedpremises.name_legal_entity"></p>
            <p v-if="items.uninhabitedpremises.transaction_amount">Сумма сделки: <b v-if="!isEdit">{{items.uninhabitedpremises.transaction_amount}}</b><input v-else v-model="editForm.transaction_amount" type="text" class="form-control" :placeholder="items.uninhabitedpremises.transaction_amount"></p>
            <p v-if="items.uninhabitedpremises.ownership">Собственность: <b v-if="!isEdit">{{items.uninhabitedpremises.ownership}}</b><input v-else v-model="editForm.ownership" type="text" class="form-control" :placeholder="items.uninhabitedpremises.ownership"></p>
            <p v-if="items.uninhabitedpremises.share_property">Доля в имуществе: <b v-if="!isEdit">{{items.uninhabitedpremises.share_property}}</b><input v-else v-model="editForm.share_property" type="text" class="form-control" :placeholder="items.uninhabitedpremises.share_property"></p>
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
    </div>
    <div v-if="isOpen" class="actions mt-3 d-flex justify-content-between mb-3">
      <button class="btn btn-outline-danger" @click="deleteItem(user.role)">Удалить</button>
      <button class="btn btn-primary" @click="editItem(user.role)"><span v-if="isEdit">Сохранить</span><span v-else>Редактировать</span></button>
    </div>
  </div>
</template>
<script>
const URL = 'http://195.49.212.34:8082'
// const URL = 'http://localhost:8082'

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
    let btn = ref('Подробнее...'),
    isLoaded = ref(false),
    isOpen = ref(false),
    items = ref({}),
    isEdit = ref(false),
    loader = ref(false),
    isInformation = ref(true),
    isRevenue = ref(false)


    let editForm = ref({
      name: '',
      apartment: '',

      bussines_id: '',
      taxation_regime: '',
      brand_crm: '',
      year_release_crm: '',
      factory_number_crm: '',
      registration_number_crm: '',
      date_registration_crm: '',
      date_de_registration_crm: '',
      place_registration_crm: '',
      license_information: '',
      type_activity: '',
      address_point_sale_crm: '',

      secondary_object_number: '',
      admin_code: '',
      full_name: '',
      ownership: '',
      share: '',
      total_area: '',
      number_title_document: '',
      name_title_document: '',
      date_title_document: '',
      date_registration: '',
      cadastral_number: '',
      type_property: '',
      real_estate_purpose: '',
      name_legal_entity: '',
      transaction_amount: '',
      share_property: ''
    })
    function getAddress(address){
      return address.replace("кв.", "").split(',').reverse()[0]
    }
    async function deleteItem(role){
      if(role === 'admin'){
        let isUninhabitedPremiseTwos = false, id = props.data.id
        if(Object.prototype.hasOwnProperty.call(props.data, 'secondary_object_number')){
          isUninhabitedPremiseTwos = true
          id = props.data.business_id
        }
        await store.dispatch('deleteItem', {url: 'legal-entities', id, isUninhabitedPremiseTwos}).then(() => {
          editForm.value = {
            name: '',
            apartment: '',

            bussines_id: '',
            taxation_regime: '',
            brand_crm: '',
            year_release_crm: '',
            factory_number_crm: '',
            registration_number_crm: '',
            date_registration_crm: '',
            date_de_registration_crm: '',
            place_registration_crm: '',
            license_information: '',
            type_activity: '',
            address_point_sale_crm: '',

            secondary_object_number: '',
            admin_code: '',
            full_name: '',
            ownership: '',
            share: '',
            total_area: '',
            number_title_document: '',
            name_title_document: '',
            date_title_document: '',
            date_registration: '',
            cadastral_number: '',
            type_property: '',
            real_estate_purpose: '',
            name_legal_entity: '',
            transaction_amount: '',
            share_property: ''
          }
          isEdit.value = false
        })
      }
    }
    async function editItem(role){
      if(!isEdit.value){
        isEdit.value = true
        return
      } else if(role === 'admin'){
        let isLegalEdit = false //, params = {}
        for(let key in editForm.value){
          if(editForm.value[key] !== '' && key !== 'id'){
            isLegalEdit = true
            // if(key === 'apartment'){
            //   params.address = props.data.address_name.split(',').splice(0, props.data.address_name.split(',').length-1).join(',') + ',' + props.data.address_name.split(',').splice(props.data.address_name.split(',').length-1, props.data.address_name.split(',').length)[0].replace(props.data.address_name.replace("кв.", "").split(',').reverse()[0].replace(' ', ''), editForm.value.apartment)
            // } else {
            //   params[key] = editForm.value[key]
            // }
          }
        }
        if(isLegalEdit){
          if(items.value.cashregistermachines.length !== 0 && items !== {}){
            let paramsCRM = {
              line_number: items.value.cashregistermachines.line_number,
              registration_number: props.data.id,
              name_np: editForm.value.name !== '' ? editForm.value.name : items.value.cashregistermachines.name_np,
              license_information: editForm.value.license_information !== '' ? editForm.value.license_information : items.value.cashregistermachines.license_information,
              business_id: editForm.value.bussines_id !== '' ? editForm.value.bussines_id : items.value.cashregistermachines.business_id,
              taxation_regime: editForm.value.taxation_regime !== '' ? editForm.value.taxation_regime : items.value.cashregistermachines.taxation_regime,
              brand_crm: editForm.value.brand_crm !== '' ? editForm.value.brand_crm : items.value.cashregistermachines.brand_crm,
              year_release_crm: editForm.value.year_release_crm !== '' ? editForm.value.year_release_crm : items.value.cashregistermachines.year_release_crm,
              factory_number_crm: editForm.value.factory_number_crm !== '' ? editForm.value.factory_number_crm : items.value.cashregistermachines.factory_number_crm,
              registration_number_crm: editForm.value.registration_number_crm !== '' ? editForm.value.registration_number_crm : items.value.cashregistermachines.registration_number_crm,
              date_registration_crm: editForm.value.date_registration_crm !== '' ? editForm.value.date_registration_crm : items.value.cashregistermachines.date_registration_crm,
              date_de_registration_crm: editForm.value.date_de_registration_crm !== '' ? editForm.value.date_de_registration_crm : items.value.cashregistermachines.date_de_registration_crm,
              place_registration_crm: editForm.value.place_registration_crm !== '' ? editForm.value.place_registration_crm : items.value.cashregistermachines.place_registration_crm,
              type_activity: editForm.value.type_activity !== '' ? editForm.value.type_activity : items.value.cashregistermachines.type_activity,
              address_point_sale_crm: editForm.value.address_point_sale_crm !== '' ? editForm.value.address_point_sale_crm : items.value.cashregistermachines.address_point_sale_crm
            }
            store.dispatch('editItem', {url: 'cash-register-machine', params: paramsCRM, id: props.data.id}).then(res => {
              if(res === 'success'){
                items.value.cashregistermachines = paramsCRM
              }
            })
          }
          
          if(items.value.uninhabitedpremises.length !== 0 && items !== {}){
            let paramsUnhabbited = {
              name_locality: 'Ауэзовский',
              street_name:`мкр. ${props.data.address_name.split(',')[0]}`,
              house_number: editForm.value.apartment !== '' ? editForm.value.apartment : `${props.data.address_name.split(',')[1]}`,
              secondary_object_number: editForm.value.secondary_object_number !== '' ? editForm.value.secondary_object_number : items.value.uninhabitedpremises.secondary_object_number,
              admin_code: editForm.value.admin_code !== '' ? editForm.value.admin_code : items.value.uninhabitedpremises.admin_code,
              full_name: editForm.value.full_name !== '' ? editForm.value.full_name : items.value.uninhabitedpremises.full_name,
              ownership: editForm.value.ownership !== '' ? editForm.value.ownership : items.value.uninhabitedpremises.ownership,
              share: editForm.value.share !== '' ? editForm.value.share : items.value.uninhabitedpremises.share,
              total_area: editForm.value.total_area !== '' ? editForm.value.total_area : items.value.uninhabitedpremises.total_area,
              number_title_document: editForm.value.number_title_document !== '' ? editForm.value.number_title_document : items.value.uninhabitedpremises.number_title_document,
              name_title_document: editForm.value.name_title_document !== '' ? editForm.value.name_title_document : items.value.uninhabitedpremises.name_title_document,
              date_title_document: editForm.value.date_title_document !== '' ? editForm.value.date_title_document : items.value.uninhabitedpremises.date_title_document,
              date_registration: editForm.value.date_registration !== '' ? editForm.value.date_registration : items.value.uninhabitedpremises.date_registration,
              cadastral_number: editForm.value.cadastral_number !== '' ? editForm.value.cadastral_number : items.value.uninhabitedpremises.cadastral_number,
              type_property: editForm.value.type_property !== '' ? editForm.value.type_property : items.value.uninhabitedpremises.type_property,
              real_estate_purpose: editForm.value.real_estate_purpose !== '' ? editForm.value.real_estate_purpose : items.value.uninhabitedpremises.real_estate_purpose,
              name_legal_entity: editForm.value.name_legal_entity !== '' ? editForm.value.name_legal_entity : items.value.uninhabitedpremises.name_legal_entity,
              business_id: editForm.value.bussines_id !== '' ? editForm.value.bussines_id : items.value.uninhabitedpremises.business_id,
              transaction_amount: editForm.value.transaction_amount !== '' ? editForm.value.transaction_amount : items.value.uninhabitedpremises.transaction_amount,
              share_property: editForm.value.share_property !== '' ? editForm.value.share_property : items.value.uninhabitedpremises.share_property,
            }
            store.dispatch('editItem', {url: 'uninhabited-premise', params: paramsUnhabbited, id: items.value.uninhabitedpremises.business_id}).then(res => {
              if(res === 'success'){
                items.value.uninhabitedpremises = paramsUnhabbited
              }
            })
          }
          let params = {
            id: props.data.id,
            name: editForm.value.name !== '' ? editForm.value.name : props.data.name,
            address: editForm.value.apartment !== '' ? `${props.data.address_name.split(',')[0]}, ${props.data.address_name.split(',')[1].replaceAll(' ', '')}, ${editForm.value.apartment}` : props.data.address_name
          }
          store.dispatch('editItem', {url: 'legal-entities', params, id: props.data.id}).then(res => {
            if(res === 'success'){
              store.commit('setItem', params)
            }
            editForm.value = {
              name: '',
              apartment: '',

              bussines_id: '',
              taxation_regime: '',
              brand_crm: '',
              year_release_crm: '',
              factory_number_crm: '',
              registration_number_crm: '',
              date_registration_crm: '',
              date_de_registration_crm: '',
              place_registration_crm: '',
              license_information: '',
              type_activity: '',
              address_point_sale_crm: '',

              secondary_object_number: '',
              admin_code: '',
              full_name: '',
              ownership: '',
              share: '',
              total_area: '',
              number_title_document: '',
              name_title_document: '',
              date_title_document: '',
              date_registration: '',
              cadastral_number: '',
              type_property: '',
              real_estate_purpose: '',
              name_legal_entity: '',
              transaction_amount: '',
              share_property: ''
            }
            isEdit.value = false
            isLoaded.value = true
            loader.value = true
            // setTimeout(() => {
            //   moreDetailes(props.data, true)
            // })
          })
          // if(res === 'success'){
          //   emit('updatedata', editForm.value)
          // }
        } else {
          isEdit.value = false
        }
      }
    }
    async function moreDetailes(data, fromEdit){
      isLoaded.value = false
      if(btn.value === 'Подробнее...' || fromEdit){
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
            loader.value = false
          })
        }
        return
      }
      btn.value = 'Подробнее...'
      isOpen.value = false
      isEdit.value = false
      emit('onopen')
    }
    function selectSubCategory(subCategory){
      switch (subCategory) {
        case 'info':
          if(!isInformation.value){
            isInformation.value = true
            isRevenue.value = false
          }
          break;
        case 'revenue':
            if(!isRevenue.value){
              isRevenue.value = true
              isInformation.value = false
            }
          break;
      }
    }
    return {
      moreDetailes,
      isLoaded,
      items,
      btn,
      isOpen,
      editItem,
      isEdit,
      editForm,
      getAddress,
      deleteItem,
      loader,
      isInformation,
      isRevenue,
      selectSubCategory
    }
  }
}
</script>
<style lang="scss" scoped>
p:not([class]){
  margin: 0;
  position: relative;
}
p:not([class])::before{
  content: "";
  position: absolute;
  bottom: 0;
  left: -4px;
  height: 0%;
  width: 2px;
  background: #2c3e50;
  transition: all .5s ease;
}
p:not([class])::after{
  content: "";
  position: absolute;
  bottom: 0;
  left: -2px;
  height: 1px;
  width: 0%;
  background: #2c3e50;
  transition: all .5s ease;

}
p:not([class]):hover::after{
  width: 100%;
}
p:not([class]):hover::before{
  height: 100%;
}
.link-btn {
  border: 1px solid rgb(217, 217, 217);
}
</style>