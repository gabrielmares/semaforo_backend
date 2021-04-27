let passport = require('passport');
let User = require('../models').UserModel;
let bcrypt = require('bcryptjs');
let localStrategy = require('passport-local').Strategy;

passport.use('signin',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
        async (email, password, done) => {
            try {
                let data = await User.findOne({
                    where: {
                        email: email
                    }
                }).then(user => {
                    if (!user) {
                        return done(501, false, { message: ' no se encontro el usuario' })
                    }
                    bcrypt.compare(password, user.password)
                        .then(result => {
                            if (!result) {
                                return done(500, false, { message: 'Contraseña no valida' });
                            }
                            return done(null, user, { message: 'Bienvenido' }) //usuario autenticado
                        })
                })
                return data;
            } catch (error) {
                return done(error)
            }
        }
    )
)



passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (user, done) { done(null, user); });