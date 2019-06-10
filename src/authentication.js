
export default ({
  user: {
    authenticated: false
  },

  authenticate(context, user) {
    this.user.authenticated = true
    context.$socket.emit('login', user)
    sessionStorage.setItem('username', user.username)
  },

  checkAuthentication() {
    const token = sessionStorage.getItem('token')

    if (token) this.user.authenticated = true
    else this.user.authenticated = false
  },

  /*getAuthenticationHeader() {
    return `Bearer ${sessionStorage.getItem('token')}`
  }*/
})