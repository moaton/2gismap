<template>
  <div class="card" style="overflow: scroll;">
    <div class="d-flex justify-content-between p-3 mb-2" style="border-radius: 0.25rem;border-bottom: 1px solid;position: sticky;top: 0;left: 0;width: 100%;z-index: 5;background: #ececec;">
      <h4 class="m-0">{{dataTo.address.split(',').splice(0,2).join(',')}}</h4>
      <span @click="$emit('closebottommenu')" style="cursor: pointer;">X</span>
    </div>
    <div>
      <div style="text-align: left;padding: 5px 15px;padding-bottom: 10px;border-radius: 0.25rem;border-bottom: 1px solid;background: #ececec;">
        <button class="btn btn-outline-success" @click="addBlock = !addBlock">Добавить</button>
        <div style="height: 0px; overflow: hidden;transition: all 0.5s ease" :style="addBlock ? 'height: auto; overflow: auto':''">
          <form @submit.prevent="addItem">
            <div>
              <label class="mb-0 mt-2" for="id">Идентификатор</label>
              <input id="id" type="text" class="form-control" v-model="legalEntitiesForm.id" placeholder="Идентификатор">
              <label class="mb-0 mt-2" for="business_id">ИИН/БИН</label>
              <input type="text" class="form-control" id="business_id" v-model="cashRegisterMachine.bussines_id" placeholder="ИИН/БИН">
              <label class="mb-0 mt-2" for="full_name">ФИО</label>
              <input type="text" class="form-control" id="full_name" v-model="unhabitted.full_name" placeholder="ФИО">
              <label class="mb-0 mt-2" for="name">Наименование</label>
              <input id="name" type="text" class="form-control" v-model="legalEntitiesForm.name" placeholder="Наименование">
              <p class="mb-0 mt-2">Адрес: {{dataTo.address.split(',').splice(0,2).join(',')}}</p>
              <label class="mb-0" for="id">Квартира</label>
              <input type="text" class="form-control" v-model="legalEntitiesForm.apartment" placeholder="Квартира">
            </div>
            <div class="text-center p-2 mb-2 mt-2 add-category" :class="addCRM ? 'adding':''"  @click="addCRM = !addCRM">Добавить ККМ</div>
            <div style="height: 0px; overflow: hidden;transition: all 0.5s ease" :style="addCRM ? 'height: 350px':''">
              <label class="mb-0 mt-2" for="taxation_regime">Режим налогообложения</label>
              <input type="text" class="form-control" id="taxation_regime" v-model="cashRegisterMachine.taxation_regime" placeholder="Режим налогообложения">
              <label class="mb-0 mt-2" for="license_information">Сведения о лицензии</label>
              <input type="text" class="form-control" id="license_information" v-model="cashRegisterMachine.license_information" placeholder="Сведения о лицензии">
              <label class="mb-0 mt-2" for="type_activity">Вид деятельности</label>
              <input type="text" class="form-control" id="type_activity" v-model="cashRegisterMachine.type_activity" placeholder="Вид деятельности">
              <label class="mb-0 mt-2" for="brand_crm">Марка ККМ с ФП</label>
              <input type="text" class="form-control" id="brand_crm" v-model="cashRegisterMachine.brand_crm" placeholder="Марка ККМ с ФП">
              <label class="mb-0 mt-2" for="factory_number_crm">Заводской номер</label>
              <input type="text" class="form-control" id="factory_number_crm" v-model="cashRegisterMachine.factory_number_crm" placeholder="Заводской номер">
              <label class="mb-0 mt-2" for="year_release_crm">Год выпуска</label>
              <input type="text" class="form-control" id="year_release_crm" v-model="cashRegisterMachine.year_release_crm" placeholder="Год выпуска">
              <label class="mb-0 mt-2" for="address_point_sale_crm">Адрес торговой точки</label>
              <input type="text" class="form-control" id="address_point_sale_crm" v-model="cashRegisterMachine.address_point_sale_crm" placeholder="Адрес торговой точки">
              <label class="mb-0 mt-2" for="registration_number_crm">Регистрационный номер</label>
              <input type="text" class="form-control" id="registration_number_crm" v-model="cashRegisterMachine.registration_number_crm" placeholder="Регистрационный номер">
              <label class="mb-0 mt-2" for="date_registration_crm">Дата постановки на учет</label>
              <input type="text" class="form-control" id="date_registration_crm" v-model="cashRegisterMachine.date_registration_crm" placeholder="Дата постановки на учет">
              <label class="mb-0 mt-2" for="date_de_registration_crm">Дата снятия с учета</label>
              <input type="text" class="form-control" id="date_de_registration_crm" v-model="cashRegisterMachine.date_de_registration_crm" placeholder="Дата снятия с учета">
              <label class="mb-0 mt-2" for="place_registration_crm">НО по месту регистрации ККМ с ФП</label>
              <input type="text" class="form-control" id="place_registration_crm" v-model="cashRegisterMachine.place_registration_crm" placeholder="НО по месту регистрации ККМ с ФП">
            </div>
            <div class="text-center p-2 mb-2 mt-2 add-category" :class="addUnhabbited ? 'adding':''"  @click="addUnhabbited = !addUnhabbited">Нежилые помещения</div>
            <div style="height: 0px; overflow-y: scroll;transition: all 0.5s ease" :style="addUnhabbited ? 'height: 350px':''">
              <label class="mb-0 mt-2" for="name_legal_entity">Наименование юридического лица или их структурных подразделений</label>
              <input type="text" class="form-control" id="name_legal_entity" v-model="unhabitted.name_legal_entity" placeholder="Наименование юридического лица">
              <label class="mb-0 mt-2" for="secondary_object_number">Номер вторичного объекта</label>
              <input type="text" class="form-control" id="secondary_object_number" v-model="unhabitted.secondary_object_number" placeholder="Номер вторичного объекта">
              <label class="mb-0 mt-2" for="admin_code">Код по классификатору административно – территориальных объектов:</label>
              <input type="text" class="form-control" id="admin_code" v-model="unhabitted.admin_code" placeholder="Код по классификатору">
              <label class="mb-0 mt-2" for="type_property">Вид объекта недвижимости:</label>
              <input type="text" class="form-control" id="type_property" v-model="unhabitted.type_property" placeholder="Вид объекта недвижимости">
              <label class="mb-0 mt-2" for="real_estate_purpose">Целевое назначение недвижимости:</label>
              <input type="text" class="form-control" id="real_estate_purpose" v-model="unhabitted.real_estate_purpose" placeholder="Целевое назначение недвижимости">
              <label class="mb-0 mt-2" for="ownership">Право собственности на земельный участок</label>
              <input type="text" class="form-control" id="ownership" v-model="unhabitted.ownership" placeholder="Право собственности на земельный участок">
              <label class="mb-0 mt-2" for="share">Доля</label>
              <input type="text" class="form-control" id="share" v-model="unhabitted.share" placeholder="Доля">
              <label class="mb-0 mt-2" for="share_property">Доля в имуществе</label>
              <input type="text" class="form-control" id="share_property" v-model="unhabitted.share_property" placeholder="Доля в имуществе">
              <label class="mb-0 mt-2" for="transaction_amount">Сумма сделки</label>
              <input type="text" class="form-control" id="transaction_amount" v-model="unhabitted.transaction_amount" placeholder="Сумма сделки">
              <label class="mb-0 mt-2" for="total_area">Площадь земельного участка</label>
              <input type="text" class="form-control" id="total_area" v-model="unhabitted.total_area" placeholder="Площадь">
              <label class="mb-0 mt-2" for="number_title_document">Номер правоустанавливающего документа на земельный участок</label>
              <input type="text" class="form-control" id="number_title_document" v-model="unhabitted.number_title_document" placeholder="Номер правоустанавливающего документа">
              <label class="mb-0 mt-2" for="name_title_document">Наименование правоустанавливающего документа на земельный участок</label>
              <input type="text" class="form-control" id="name_title_document" v-model="unhabitted.name_title_document" placeholder="Наименование правоустанавливающего документа">
              <label class="mb-0 mt-2" for="date_title_document">Дата правоустанавливающего документа на земельный участок</label>
              <input type="text" class="form-control" id="date_title_document" v-model="unhabitted.date_title_document" placeholder="Дата правоустанавливающего документа">
              <label class="mb-0 mt-2" for="date_registration">Дата регистрации права на земельный участок</label>
              <input type="text" class="form-control" id="date_registration" v-model="unhabitted.date_registration" placeholder="Дата регистрации права на земельный участок">
              <label class="mb-0 mt-2" for="cadastral_number">Кадастровый номер земельного участка</label>
              <input type="text" class="form-control" id="cadastral_number" v-model="unhabitted.cadastral_number" placeholder="Кадастровый номер земельного участка">
            </div>
            <div class="d-flex justify-content-end mt-2">
              <button class="btn btn-primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
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
import store from '../store'

import { ref } from '@vue/reactivity'
export default {
  props: ['dataTo'],
  components: {
    detailes
  },
  watch: {
    dataTo(){
      console.log(this.dataTo);
    }
  },
  mounted() {
    console.log('osaoasodso');
  },
  setup(props) {
    let addBlock = ref(false), addCRM = ref(false), addUnhabbited = ref(false)
    let legalEntitiesForm = ref({
      id: '',
      name: '',
      apartment: '',
    })
    let cashRegisterMachine = ref({
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
      address_point_sale_crm: ''
    })
    let unhabitted = ref({
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
  
    async function addItem(){
      console.log(legalEntitiesForm.value.id,  legalEntitiesForm.value.name, legalEntitiesForm.value.apartment )
      // if(legalEntitiesForm.value.id !== '' && legalEntitiesForm.value.name !== '' && legalEntitiesForm.value.apartment !== ''){
        let params = {
          id: legalEntitiesForm.value.id,
          name: legalEntitiesForm.value.name,
          address: `мкр. ${props.dataTo.address.split(',')[0]}, ${props.dataTo.address.split(',')[1].replaceAll(' ', '')}, ${legalEntitiesForm.value.apartment}`
        }
        await store.dispatch('addItem', {items: params, url: '/api/legal-entities'})
      // }
      // if(addCRM.value){
        let paramsCRM = {
          line_number: Math.floor(Math.random() * (2147483647 - 20000) + 20000),
          registration_number: legalEntitiesForm.value.id,
          name_np: legalEntitiesForm.value.name,
          license_information: cashRegisterMachine.value.license_information,
          business_id: cashRegisterMachine.value.bussines_id,
          taxation_regime: cashRegisterMachine.value.taxation_regime,
          brand_crm: cashRegisterMachine.value.brand_crm,
          year_release_crm: cashRegisterMachine.value.year_release_crm,
          factory_number_crm: cashRegisterMachine.value.factory_number_crm,
          registration_number_crm: cashRegisterMachine.value.registration_number_crm,
          date_registration_crm: cashRegisterMachine.value.date_registration_crm,
          date_de_registration_crm: cashRegisterMachine.value.date_de_registration_crm,
          place_registration_crm: cashRegisterMachine.value.place_registration_crm,
          type_activity: cashRegisterMachine.value.type_activity,
          address_point_sale_crm: cashRegisterMachine.value.address_point_sale_crm
        }
        await store.dispatch('addItem', {items: paramsCRM, url: '/api/cash-register-machine'})
      // }
      // if(addUnhabbited.value){
        let paramsUnhabbited = {
          name_locality: 'Ауэзовский',
          street_name:`мкр. ${props.dataTo.address.split(',')[0]}`,
          house_number: `${props.dataTo.address.split(',')[1]}`,
          secondary_object_number: unhabitted.value.secondary_object_number,
          admin_code: unhabitted.value.admin_code,
          full_name: unhabitted.value.full_name,
          ownership: unhabitted.value.ownership,
          share: unhabitted.value.share,
          total_area: unhabitted.value.total_area,
          number_title_document: unhabitted.value.number_title_document,
          name_title_document: unhabitted.value.name_title_document,
          date_title_document: unhabitted.value.date_title_document,
          date_registration: unhabitted.value.date_registration,
          cadastral_number: unhabitted.value.cadastral_number,
          type_property: unhabitted.value.type_property,
          real_estate_purpose: unhabitted.value.real_estate_purpose,
          name_legal_entity: unhabitted.value.name_legal_entity,
          business_id: cashRegisterMachine.value.bussines_id,
          transaction_amount: unhabitted.value.transaction_amount,
          share_property: unhabitted.value.share_property
        }
        await store.dispatch('addItem', {items: paramsUnhabbited, url: '/api/uninhabited-premise'})
      // }
    }
    return {
      addItem,
      addBlock,
      addCRM,
      legalEntitiesForm,
      cashRegisterMachine,
      addUnhabbited,
      unhabitted,
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
  .add-category{
    border: 1px solid #686868;
    background: rgb(236, 236, 236);
    color: #686868;
    cursor: pointer;
    transition: all .3s ease;
  }
  .add-category:hover{
    color: #fff;
    border: 1px solid #28a745;
    background: #28a745;
  }
  .adding{
    color: #fff;
    border: 1px solid #28a745;
    background: #28a745;
  }
  @media(max-width: 768px) {
    .card{
      width: 100%;
      height:250px
    }
  }
</style>