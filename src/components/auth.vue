<template>
  <div class="col-12 justify-content-center align-items-center pt-4 pb-4">
    <div class="auth-card p-2" :class="{'col-md-4 offset-md-4': !adduser}">
      <h3 v-if="adduser" class="mb-4" style="position:relative">
        <span>Добавить пользователя</span>
        <span style="position: absolute; top: 0; right: 0;cursor:pointer" @click="$emit('close')">X</span>
      </h3>
      <div class="auth-title d-flex justify-content-center">
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
            <input :disabled="adding" v-model="form.username" class="form-control mt-3" :class="{'border-danger': isExist}" type="text" placeholder="Имя пользователя">
            <input :disabled="adding" v-model="form.password" class="form-control mt-3" type="password" placeholder="Пароль">
            <input :disabled="adding" v-model="form.password_repeat" class="form-control mt-3" type="password" placeholder="Повторите пароль">
          </div>
          <p class="mt-3 mb-0 text-left text-secondary">Личная информация</p>
          <div>
            <div class="d-flex justify-content-center">
              <div class="custom-control custom-radio mr-3">
                <input :disabled="adding" v-model="form.role" type="radio" id="employee" value="employee" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="employee">Сотрудник</label>
              </div>
              <div class="custom-control custom-radio ml-2">
                <input v-model="form.role" type="radio" id="admin" value="admin" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="admin">Админ</label>
              </div>
            </div>
            <input :disabled="adding" v-model="form.name" class="form-control mt-3" type="text" placeholder="Имя">
            <input :disabled="adding" v-model="form.surname" class="form-control mt-3" type="text" placeholder="Фамилия">
            <input :disabled="adding" v-model="form.post" class="form-control mt-3" type="text" placeholder="Должность">
            <input :disabled="adding" v-model="form.phone" class="form-control mt-3" type="tel" placeholder="+1-234-567-89-10">
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
        phone: '',
        role: 'employee',
      },
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
  },
  methods: {
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
</style>