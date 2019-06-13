const pg = require('pg')

const dbclient = new pg.Client("postgres://postgres:12345@localhost:5432/chat") // строка подключения к бд

dbclient.connect()  // подключение к бд
    .then(() => console.log('Pg успешно подключен'))
    .catch((err) => console.log(err))

module.exports = dbclient;
