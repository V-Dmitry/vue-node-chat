<template>
  <form class="form-signin text-center" name="form-signin" id="login">
    <h1 class="h2 mb-3 font-weight-normal">Вход в чат</h1>
    <input v-model="userName" class="form-control" type="text" placeholder="Имя пользователя" required autofocus>
    <input v-model="userPass" class="form-control" type="password" placeholder="Пароль" required>
    <input type="button" class="brd btn btn-lg btn-block" value="Войти" v-on:click="authenticate">

    <p class="info mt-5 mb-3 text-muted"><br>© Dmitry Voronchihin, 2019<br>vdima775@gmail.com</br></br></p>

  </form>
</template>

<script>
  import auth from '@/authentication.js'
  
  export default ({
    data() {
      return {
        userName: null,
        userPass: null,
        user: {
          authenticated: false
        },
      }
    },

    methods: {
      authenticate() {
        if (!this.userName) alert('Необходимо ввести имя')
        else if (!this.userPass) alert('Необходимо ввести пароль')
        else {
          auth.authenticate(this, {username: this.userName, userpass: this.userPass}, '/')
        }
      }
    }
  })

</script>

<style>
  .form-signin {
    width: 100%;
    max-width: 30rem;
    margin: auto;
  }

</style>
