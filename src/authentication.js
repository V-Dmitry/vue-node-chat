
export default ({
  user: {
    authenticated: false
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