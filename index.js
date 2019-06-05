const express = require('express');
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:8000'}))

const server = app.listen(3000, function() {
	console.log("Server is started")
});

const socket = require('socket.io')(server);

var message =  {
	author: "",
	text: "",
	date: ""
  }

var messages = []

socket.on('connect', function (client) {

	console.log('К чату подключился новый пользователь');

	try {

		client.on('login', function (user) {
			console.log(`Пользователь ${user.username} вошел в чат`);
		})

		client.on('logout', function (user) {
			console.log(`Пользователь ${user.username} вышел из чата`);
		})

		client.on('disconnect', function (user) {
			console.log(`Пользователь ${user.username} отсоединился от чата`);
		})
		
	}
	catch (err) {
		console.log(err);
		client.disconnect();
	}
})