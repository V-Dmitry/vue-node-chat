const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:8000' }))

const server = app.listen(3000, function () {
	console.log("Сервер запущен на 3000 порту")
});

require('./nodejs/app/app.js')(server)