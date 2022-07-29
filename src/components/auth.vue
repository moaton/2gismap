<template>
  <div class="col-12 justify-content-center align-items-center pt-4 pb-4">
    <div class="auth-card col-md-4 offset-md-4 p-2">
      <h3 class="mb-4">Вход в систему</h3>
      <div class="auth-title d-flex justify-content-center">
        <button @click="authType(1)" class="btn mr-4" :class="type === 'reg' ? 'btn-primary' : 'btn-outline-primary'">Регистрация</button>
        <button @click="authType(2)" class="btn ml-4" :class="type === 'auth' ? 'btn-primary' : 'btn-outline-primary'">Авторизация</button>
      </div>
      <form @submit.prevent="onSubmit">
        <div v-if="type === 'auth'" class="mt-3">
          <span class="text-danger" v-if="isIncorrect">Username or password is not correct</span>
          <input v-model="form.username" class="form-control mt-3" :class="{'border-danger': isIncorrect}" type="text" placeholder="Имя пользователя">
          <input v-model="form.password" class="form-control mt-3" :class="{'border-danger': isIncorrect}" type="password" placeholder="Пароль">
        </div>
        <div v-else>
          <p class="mt-3 text-left text-secondary">Данные для входа</p>
          <div>
            <span class="text-danger" v-if="isExist">The user has been created</span>
            <input v-model="form.username" class="form-control mt-3" :class="{'border-danger': isExist}" type="text" placeholder="Имя пользователя">
            <input v-model="form.password" class="form-control mt-3" type="password" placeholder="Пароль">
            <input v-model="form.password_repeat" class="form-control mt-3" type="password" placeholder="Повторите пароль">
          </div>
          <p class="mt-3 mb-0 text-left text-secondary">Личная информация</p>
          <div>
            <div class="d-flex justify-content-center">
              <div class="custom-control custom-radio mr-3">
                <input v-model="form.role" type="radio" id="employee" value="employee" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="employee">Сотрудник</label>
              </div>
              <div class="custom-control custom-radio ml-2">
                <input v-model="form.role" type="radio" id="admin" value="admin" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="admin">Админ</label>
              </div>
            </div>
            <input v-model="form.name" class="form-control mt-3" type="text" placeholder="Имя">
            <input v-model="form.surname" class="form-control mt-3" type="text" placeholder="Фамилия">
            <input v-model="form.post" class="form-control mt-3" type="text" placeholder="Должность">
            <input v-model="form.phone" class="form-control mt-3" type="tel" placeholder="+1-234-567-89-10">
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-primary mt-3"><span v-if="type === 'auth'">Войти</span><span v-else>Сохранить</span></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import store from '../store'

export default {
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
      let params = {
        username: this.form.username,
        password: this.form.password,
        type: this.type
      }
      if(this.type === 'reg'){
        params.name = this.form.name
        params.surname = this.form.surname
        params.post = this.form.post
        params.phone = this.form.phone,
        params.role = this.form.role
      }
      if(this.type === 'reg' && this.form.password !== this.form.password_repeat){
        return
      }
      if(this.type === 'reg'){
        store.dispatch('auth', {params, isReg: true}).then(res => {
          if(res === 'success')
            this.$emit('authed')
        })
      } else {
        store.dispatch('auth', {params, isReg: false}).then(res => {
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