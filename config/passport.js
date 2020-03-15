const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al Modelo donde vamos a auntentificar
const Usuarios = require('../models/Usuarios');

// local strategy - login con credenciales propios (usuarios y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y passpord
        {
            usernameField: 'email',
            passwordField: 'password'
        },

        async (email,password,done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                // El usuario existe pero el password no es correcto
                if(!usuario.verificarPassword(password)){
                    return done(null,false, {
                        message: 'Password Incorrecto'
                    })
                }
                // el mail existe y el password correcto
                return done(null,usuario);
            } catch (error) {
                // Ese ssuario no existe
                return done(null,false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario,callback) => {
    callback(null,usuario);
})

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null,usuario);
})

module.exports = passport;