const express = require('express');
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken');

const app = express();

const server = app.listen('3000');

const socket = require('socket.io')(server);

socket.on('connect', function (client) {

	try {

		client.on('connection', function (user) {
			console.log(`Пользователь ${user.username} подключился к чату`);
		})
		
	}
	catch (err) {
		console.log(err);
		client.disconnect();
	}
})