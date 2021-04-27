const express = require('express');
const app = express();
const loginRoutes = require('./routes/login');
const requestCredits = require('./routes/solicitudes');
const cors = require('cors');
const models = require('./models');
const passport = require('passport');
const update = require('./cronjobs');
const { SECRETCOOKIES, PORT } = require('./enviroment')
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('./helpers/passport');


app.use(morgan('combined'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})
app.use(cookieParser(process.env.SECRETCOOKIES || SECRETCOOKIES));
app.use(helmet());
app.use(passport.initialize());
const port = process.env.PORT || PORT;
app.set('port', port);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: true }));
app.use('/api', loginRoutes);
app.use('/api/operaciones', requestCredits);
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en puerto ' + port)
});

module.exports = app;