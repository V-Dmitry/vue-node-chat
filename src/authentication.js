import {router} from '@/main.js'
import {socket} from '@/main.js'

export default({
  user: { 
    authenticated: false 
  },

  authenticate (context, user, redirect) {
   this.user.authenticated = true
   
   router.push(redirect)
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