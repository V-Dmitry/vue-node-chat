module.exports = function (server) {
    const socket = require('socket.io')(server);
    const db = require('../db/dbqueries')
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs')

    var salt = bcrypt.genSaltSync(10)   // генерация соли для хеша паролей
    var secret = 'wefrgfweqr3r3TGRGWt435646uhtWRGegrw'  // секретный ключ для токена

    socket.on('connect', function (client) {    // подключение

        console.log('К чату подключился новый пользователь');

        try {

            client.on('login', function (user) {    // вход пользователя в чат
                var token = jwt.sign({ id: user.username }, secret) // генерация токена
                db.getUserByName(user, function (res) {
                    if (res.rowCount > 0) {     // если пользователь существует
                        if (bcrypt.compareSync(user.userpass, res.rows[0].password)) {  // если хеши паролей совпадают
                            db.changeStatus(user.username, 1, function () { // изменение статуса пользователя на online
                                db.getMessages(function (msgs) {    // получаем историю сообщений из бд
                                    db.getOnlineUsers(function (users) {    // получаем пользователей чата
                                        client.emit('login-success', token) // отправляем токен клиенту
                                        client.broadcast.emit('new-message', { text: `Пользователь ${user.username} вошел в чат` }) // участникам чата сообщаем о входе нового пользователя
                                        client.emit('get-messages', msgs)   // отправляем вошедшему пользователю историю сообщений
                                        client.broadcast.emit('get-users', users)   // отправляем актуальный список пользователей чата всем пользователям
                                        client.emit('get-users', users) // отправляем акутальный список пользователей вошедшему пользователю
                                    })
                                })
                            })
                        }
                        else {  // если пароли не совпадают
                            client.emit('login-fail')   // сообщаем об ошибке
                        }
                    }
                    else {  // если пользователь не существует
                        db.addUser(bcrypt, user, salt, function (newuser) {    // добавляем нового пользователя в бд
                            db.changeStatus(user.username, 1, function () {
                                db.getMessages(function (msgs) {
                                    db.getOnlineUsers(function (users) {
                                        client.emit('login-success', token)
                                        client.broadcast.emit('new-message', { text: `Пользователь ${newuser.username} вошел в чат` })
                                        client.emit('get-messages', msgs)
                                        client.broadcast.emit('get-users', users)
                                        client.emit('get-users', users)
                                    })
                                })
                            })
                        })
                    }
                })
            })

            client.on('update', function () {   // обновление страницы чата
                db.getMessages(function (msgs) {    // получаем историю сообщений
                    db.getOnlineUsers(function (users) {    // получаем актуальный список пользователей
                        client.emit('update', { messages: msgs, users: users }) // отправляем данные клиенту
                    })
                })
            })

            client.on('logout', function (username) {   // выход пользователя из чата
                client.broadcast.emit('user-logout', { text: `Пользователь ${username} вышел из чата` })    // сообщаем пользователям чата о выходу пользователя
                db.changeStatus(username, 2, function () {  // измененяем статус пользователя на offline
                    db.getOnlineUsers(function (users) { // получаем актуальный список пользователей
                        client.broadcast.emit('get-users', users)   // отправляем актуальный список пользователей
                    })
                })
            })

            client.on('disconnect', function () {   // разъединение соединения
                console.log(`Пользователь отсоединился от чата`);
            })

            client.on('new-message', function (newmessage) {    // новое сообщение в чате
                db.addMessage(newmessage, function () { // добавляем сообщение в базу
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
}