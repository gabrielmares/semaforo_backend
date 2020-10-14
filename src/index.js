const express = require('express');
const app = express();
const loginRoutes = require('./routes/login');
const requestCredits = require('./routes/solicitudes');
const cors = require('cors');
const models = require('./models');
const passport = require('passport');

require('./helpers/passport');

console.log(process.env.DBMYSQL)

app.use(passport.initialize());
const port = process.env.PORT || 81;
app.set('port', process.env.PORT || port);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));
app.use('/api', loginRoutes);
app.use('/api/req', requestCredits);
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en puerto ' + port)
});

module.exports = app;