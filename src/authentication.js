
export default({
  user: { 
    authenticated: false 
  },

  authenticate (context, user, redirect) {
    this.user.authenticated = true
          context.$socket.emit('login', user)
          context.$router.push('/')
  },

  checkAuthentication () {
    const token = sessionStorage.getItem('token')

    if (token) this.user.authenticated = true
      else this.user.authenticated = false
    },

  getAuthenticationHeader () {
    return `Bearer ${sessionStorage.getItem('token')}`
  }
})