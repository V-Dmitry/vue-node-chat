const express = require('express');
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pg = require('pg')
const bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(10)
var secret = 'wefrgfweqr3r3TGRGWt435646uhtWRGegrw'

const dbclient = new pg.Client("postgres://postgres:12345@localhost:5432/chat")
dbclient.connect()
	.then(() => console.log('Pg успешно подключен'))
	.catch((err) => console.log(err))

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:8000' }))

const server = app.listen(3000, function () {
	console.log("Сервер запущен на 3000 порту")
});

const socket = require('socket.io')(server);

function getMessages(callback) {
	dbclient.query('select message.id, "user".username as author, message.text, message.date \
	from message \
	inner join "user" on "user".id = message.user_id')
		.then((res) => {
			callback(res.rows)
		})
		.catch((err) => {
			console.log(err)
		})
}

function getUsers() {
	dbClient.query('select id, username from public.user')
}

socket.on('connect', function (client) {

	console.log('К чату подключился новый пользователь');

	try {

		client.on('login', function (user) {
			dbclient.query('select id, username, password from public.user where username=$1', [user.username])
				.then((res) => {
					if (res.rowCount > 0) {
						if (bcrypt.compareSync(user.userpass, res.rows[0].password)) {
							var token = jwt.sign({id:user.username}, secret)
							getMessages(function(res) {
								client.emit('login-success')
								client.broadcast.emit('new-message', {text:`Пользователь ${user.username} вошел в чат`})
								client.emit('login', res)
							})
							console.log(`Пользователь ${user.username} вошел в чат`);
						}
						else {
							client.emit('login-fail')
						}
					}
					else {
						dbclient.query('insert into public.user(username, password) values ($1,$2)', [user.username, bcrypt.hashSync(user.userpass, salt)])
							.then((res) => {
								getMessages((res) => {
									client.emit('login-success')
									client.broadcast.emit('new-message', {text:`Пользователь ${user.username} вошел в чат`})
									client.emit('login', res)
								})
								console.log(`Пользователь ${user.username} вошел в чат`);
							})
							.catch((err) => {
								console.log(err)
							})
					}
				})
				.catch((err) => {
					console.log(err)
				})

		})

		client.on('logout', function (username) {

			client.broadcast.emit('user-logout', {text: `Пользователь ${username} вышел из чата`})
			console.log(`Пользователь ${username} вышел из чата`);
		})

		client.on('disconnect', function () {
			console.log(`Пользователь отсоединился от чата`);
		})

		client.on('new-message', function (newmessage) {
			dbclient.query('insert into message(user_id, text, date) values ((select id from public.user where username=$1), $2, $3::abstime)', [newmessage.author, newmessage.text, newmessage.date])
				.then(() => {
					client.broadcast.emit('new-message', newmessage)
					client.emit('new-message', newmessage)
				})
		})

	}
	catch (err) {
		console.log(err);
		client.disconnect();
	}
})