module.exports = function (server) {
    const socket = require('socket.io')(server);
    const db = require('../db/dbqueries')
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs')

    var salt = bcrypt.genSaltSync(10)
    var secret = 'wefrgfweqr3r3TGRGWt435646uhtWRGegrw'

    socket.on('connect', function (client) {

        console.log('К чату подключился новый пользователь');

        try {

            client.on('login', function (user) {
                var token = jwt.sign({ id: user.username }, secret)
                db.getUserByName(user, function (res) {
                    if (res.rowCount > 0) {
                        if (bcrypt.compareSync(user.userpass, res.rows[0].password)) {
                            db.changeStatus(user.username, 1, function () {
                                db.getMessages(function (msgs) {
                                    db.getOnlineUsers(function (users) {
                                        client.emit('login-success', token)
                                        client.broadcast.emit('new-message', { text: `Пользователь ${user.username} вошел в чат` })
                                        client.emit('get-messages', msgs)
                                        client.broadcast.emit('get-users', users)
                                        client.emit('get-users', users)
                                    })
                                })
                            })
                        }
                        else {
                            client.emit('login-fail')
                        }
                    }
                    else {
                        db.addUser(bcrypt, user, salt, function (newuser) {
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

            client.on('update', function () {
                db.getMessages(function (msgs) {
                    db.getOnlineUsers(function (users) {
                        client.emit('update', { messages: msgs, users: users })
                    })
                })
            })

            client.on('logout', function (username) {
                client.broadcast.emit('user-logout', { text: `Пользователь ${username} вышел из чата` })
                db.changeStatus(username, 2, function () {
                    db.getOnlineUsers(function (users) {
                        client.broadcast.emit('get-users', users)
                    })
                })
            })

            client.on('disconnect', function () {
                console.log(`Пользователь отсоединился от чата`);
            })

            client.on('new-message', function (newmessage) {
                db.addMessage(newmessage, function () {
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

    function loginSuccess(client, msgs, users, user, token) {
        client.emit('login-success', token)
        client.broadcast.emit('new-message', { text: `Пользователь ${user.username} вошел в чат` })
        client.emit('get-messages', msgs)
        client.broadcast.emit('get-users', users)
        client.emit('get-users', users)
    }
}