const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const enviarEmail = require('../handlers/email');

// autentificar al usuario
const autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos compos son obligatorios'
});

// funcion para revisar si el usuario esta logueado o no
const usuarioAutenticado = (req,res,next) => {
    // si el usuario esta autentificado
    if(req.isAuthenticated()){
        return next();
    }

    // sino esta autentificado, redireccionar al formulario
    return res.redirect('/iniciar-sesion');
};

// funcion para cerrar sesion 
const cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

// genera un token si el usuario es valido
const enviarToken = async (req,res) => {
    // verificar que el usuario exista
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where : {email}});

    // si no existe el usuario
    if(!usuario){
        req.flash('error',"No existe esa Cuenta")
        res.render('restablecer',{
            nombrePagina: 'Reestablecer tu Contraseña',
            mensajes: req.flash()
        })
    }

    // usuario si existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion  = Date.now() + 3600000;
    // guuardando en la bd
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    // enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });

    // terminar el flujo
    req.flash('correcto','Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

const validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if(!usuario){
        req.flash('error','No Valido');
        res.redirect('/restablecer');
    }

    // formulario para poder generar el password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer Contraseña'
    });
}

// cambia el password por uno nuevo
const actualizarPassword = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario){
        req.flash('error','No Valida');
        res.redirect('/restablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    await usuario.save();

    req.flash('correcto','Tu password ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}

module.exports = {
    autenticarUsuario,
    usuarioAutenticado,
    cerrarSesion,
    enviarToken,
    validarToken,
    actualizarPassword
};