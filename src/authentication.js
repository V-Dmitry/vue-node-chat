
export default ({
  user: {
    authenticated: false
  },

  checkAuthentication() { // проверка токена пользователя
    const token = sessionStorage.getItem('token')

    if (token) this.user.authenticated = true
    else this.user.authenticated = false
  }
})