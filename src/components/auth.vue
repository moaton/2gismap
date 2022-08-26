<template>
  <div class="col-12 justify-content-center align-items-center pt-4 pb-4">
    <div class="auth-card p-2" :class="{'col-md-4 offset-md-4': !adduser}">
      <h4 v-if="adduser" class="mb-4" style="position:relative">
        <span>Добавить пользователя</span>
        <span style="position: absolute; top: 0; right: 0;cursor:pointer" @click="$emit('close')">X</span>
      </h4>
      <div v-if="!adduser" class="auth-title d-flex justify-content-center">
        <p>Авторизация</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div v-if="type === 'auth' && !adduser" class="mt-3">
          <span class="text-danger" v-if="isIncorrect">Username or password is not correct</span>
          <input v-model="form.username" class="form-control mt-3" :class="{'border-danger': isIncorrect}" type="text" placeholder="Имя пользователя">
          <input v-model="form.password" class="form-control mt-3" :class="{'border-danger': isIncorrect}" type="password" placeholder="Пароль">
        </div>
        <div v-else>
          <p class="mt-3 text-left text-secondary">Данные для входа</p>
          <div>
            <span class="text-danger" v-if="isExist">The user has been created</span>
            <label for="username">
              <input id="username" :disabled="adding" v-model="form.username" class="" :class="{'border-danger': isExist}" type="text" placeholder="Имя пользователя">
              <span>Имя пользователя</span>
            </label>
            <label for="password">
              <input id="password" :disabled="adding" v-model="form.password" class="" type="password" placeholder="Пароль">
              <span>Пароль</span>
            </label>
            <label for="password_repeat">
              <input id="password_repeat" :disabled="adding" v-model="form.password_repeat" class="" type="password" placeholder="Повторите пароль">
              <span>Повторите пароль</span>
            </label>
          </div>
          <p class="mt-3 mb-0 text-left text-secondary">Личная информация</p>
          <div>
            <label for="name">
              <input id="name" :disabled="adding" v-model="form.name" type="text" placeholder="Имя">
              <span>Имя</span>
            </label>
            <label for="surname">
              <input id="surname" :disabled="adding" v-model="form.surname" type="text" placeholder="Фамилия">
              <span>Фамилия</span>
            </label>
            <label for="phone">
              <input id="phone" :disabled="adding" v-model="form.phone" type="tel" placeholder="+71234567890">
              <span>Номер телефона</span>
            </label>
            <treeselect class="text-input" id="post" v-model="value" :options="options" :searchable="false" :clearable="false" :default-expand-level="1"></treeselect>
            <label class="label" for="post">Должность: {{getPost}}</label>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-primary mt-3"><span v-if="type === 'auth' && !adduser">Войти</span><span v-else>Сохранить</span></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import store from '../store'

export default {
  props: ['adduser'],
  data() {
    return {
      type: 'auth',
      form: {
        username: '',
        password: '',
        password_repeat: '',
        name: '',
        surname: '',
        post: '',
        phone: '+7',
        role: 'employee',
      },
      value: 'employee',
      options: [ 
        {
          id: 'employee',
          label: 'Сотрудник',
          children: [
            {id: 'employee_owners', label: 'Сотрудник по собственникам'},
            {id: 'employee_reg', label: 'Сотрудник по зарегестрированным'},
          ]
        },
        {
          id: 'revenue-employee',
          label: 'Сотрудник по доходам',
          children: [
            {id: 'revenue-employee_owners', label: 'Сотрудник по доходам собственников'},
            {id: 'revenue-employee_reg', label: 'Сотрудник по доходам зарегестрированных'},
          ]
        },
        {
          id: 'moderator', 
          label: 'Модератор',
          children: [
            {id: 'moderator_owners', label: 'Модератор собственников'},
            {id: 'moderator_reg', label: 'Модератор зарегестрированных'},
          ]
        },
        {
          id: 'moderator-data', 
          label: 'Модератор по данным',
          children: [
            {id: 'moderator-data_owners', label: 'Модератор данных собственников'},
            {id: 'moderator-data_reg', label: 'Модератор данных зарегестрированных'},
          ]
        }
      ],
      adding: false
    }
  },
  computed: {
    isIncorrect(){
      return store.getters.getIncorrectStatus
    },
    isExist(){
      return store.getters.getExistUserStatus
    },
    getPost(){
      return this.getPostMethod()
    }
  },
  methods: {
    getPostMethod(){
      if(this.value.includes('_')){
        let parent = this.value.split('_')[0]
        return this.options.find(item => item.id === parent).children.find(sItem => sItem.id === this.value).label
      } else {
        return this.options.find(item => item.id === this.value).label
      }
    },
    async onSubmit(){
      this.adding = true
      let params = {
        username: this.form.username,
        password: this.form.password,
        type: this.type
      }
      if(this.adduser){
        params.name = this.form.name
        params.surname = this.form.surname
        params.post = this.form.post
        params.phone = this.form.phone,
        params.role = this.form.role
        params.type = 'reg'
      }
      if(this.adduser && this.form.password !== this.form.password_repeat){
        return
      }
      if(this.adduser){
        store.dispatch('auth', {params, isReg: true}).then(res => {
          this.adding = false
          if(res === 'success')
            this.$emit('authed')
        })
      } else {
        store.dispatch('auth', {params, isReg: false}).then(res => {
          this.adding = false
          if(res === 'success')
            this.$emit('authed')
        })
      }
    },
    authType(type){
      switch (type) {
        case 1:
          this.type = 'reg'
          break;
        case 2:
          this.type = 'auth'
          break;
      }
    }
  },
}
</script>

<style>
.auth-card{
  border: 1px solid #eee;
  border-radius: 0.25rem;
}
label{
  width: 100%;
  margin-bottom:15px;
  position:relative;
  border-bottom:1px solid #ddd;
}
label > input{
  width:100%;
  padding:10px 0px;
  margin-top:20px;
  border:none;
  outline:none;
}
label > input::placeholder{
  opacity:0;
}
label > span{
  position:absolute;
  top:0;
  left:0;
  transform:translateY(30px);
  font-size:0.825em;
  transition-duration:300ms;
}
label:focus-within > span,
input:not(:placeholder-shown) + span{
    color:#007bff;
    transform:translateY(0px);
}
</style>