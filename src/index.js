const express = require('express');
const app = express();
const endpoints = require('./routes');
const cors = require('cors');

const port = process.env.PORT || 81;
app.set('port', process.env.PORT || port);

app.use(cors({ origin: true }));

app.use('/', endpoints);
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en puerto ' + port)
});

module.exports = app;