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

var messages = []
var users = []

socket.on('connect', function (client) {

	console.log('К чату подключился новый пользователь');

	try {

		client.on('login', function (user) {
			console.log(`Пользователь ${user.username} вошел в чат`);
			users.push(user.username)
			client.emit('login', messages)
			messages.push({text: `Пользователь ${user.username} вошел в чат`})
			client.broadcast.emit('login', messages)
		})

		client.on('logout', function (username) {
			console.log(`Пользователь ${username} вышел из чата`);
			messages.push({text: `Пользователь ${username} вышел из чата`})
			client.broadcast.emit('logout', messages[messages.length-1])
		})

		client.on('disconnect', function () {
			console.log(`Пользователь отсоединился от чата`);
		})

		client.on('new-message', function (newmessage) {
			messages.push(newmessage)
			client.broadcast.emit('newMessage', newmessage)
			client.emit('newMessage', newmessage)
		})
		
	}
	catch (err) {
		console.log(err);
		client.disconnect();
	}
})