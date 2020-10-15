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
                        return done(403, false, { message: ' no se encontro el usuario' })
                    }
                    bcrypt.compare(password, user.password)
                        .then(result => {
                            if (!result) {
                                return done(null, false, { message: 'Contraseña no valida' });
                            }
                            console.log('Usuario autenticado');
                            return done(null, user, { message: 'Bienvenido' })
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