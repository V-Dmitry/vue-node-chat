import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import VueSocket from 'vue-socket.io'

import Auth from '@/components/auth'
import Chat from '@/components/chat'
import auth from '@/authentication.js'

Vue.config.productionTip = false
Vue.use(Router)

var socket = new VueSocket({
	debug: true,
	connection: 'http://localhost:3000'
})

Vue.use(socket)
auth.checkAuthentication()

var router = new Router({
	routes: [
		{
			path: '/',
			component: Chat,
			meta: {
				requiredAuth: true
			}
		},
		{
			path: '/login',
			component: Auth,
			meta: {
				requiredAuth: false
			}
		}
	],
	mode: 'history'
})

router.beforeEach((to, from, next) => {
	if (to.meta.requiredAuth) {
		if (auth.user.authenticated) {
			next()
		} else {
			router.push('/login')
		}
	} else {
		next()
	}
})

export {router, socket}

new Vue({
	router,
	socket,
	template: '<App/>',
	components: { App }
}).$mount('#app')
