const dbclient = require('./dbconnect')

module.exports = {

    getMessages: function (callback) {  // функция получения истории сообщений
        dbclient.query('select message.id, "user".username as author, message.text, message.date \
    from message \
    left join "user" on "user".id = message.user_id')
            .then((res) => {
                callback(res.rows)
            })
            .catch((err) => {
                console.log(err)
            })
    },

    addMessage: function (message, callback) {  // функция добавления нового сообщения в базу
        dbclient.query('insert into message(user_id, text, date) values ((select id from public.user where username=$1), $2, $3::abstime)', [message.author, message.text, message.date])
            .then(() => {
                callback()
            })
            .catch((err) => {
                console.log(err)
            })
    },

    getOnlineUsers: function (callback) {   // функция получения актуального псиска пользователей в чате
        dbclient.query('select id, username from public.user where status=1')
            .then((res) => {
                callback(res.rows)
            })
            .catch((err) => {
                console.log(err)
            })
    },

    getUserByName: function (user, callback) {  // функция получения пользователя по его имени
        dbclient.query('select id, username, password from public.user where username=$1', [user.username])
            .then((res) => {
                callback(res)
            })
            .catch((err) => {
                console.log(err)
            })
    },

    addUser: function (cryptFunc, user, salt, callback) {   // функция добавления нового пользователя
        dbclient.query('insert into public.user(username, password) values ($1,$2) returning username', [user.username, cryptFunc.hashSync(user.userpass, salt)])
            .then((res) => {
                callback(res.rows[0])
            })
            .catch((err) => {
                console.log(err)
            })
    },

    changeStatus: function (username, status, callback) {   // функция изменения статуса пользователя
        dbclient.query('update public.user set status=$2 where username=$1', [username, status])
            .then(() => {
                callback()
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

