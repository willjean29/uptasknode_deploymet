const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
const formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina : 'Crear Cuenta en Uptask'
    });
}

const formIniciarSesion = (req,res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina : 'Crear Cuenta en Uptask',
        error
    });
}

const crearCuenta = async (req,res) => {
    // leer los datos
    const {email, password} =req.body;

    try {
        // crear usuario
        await Usuarios.create({
            email,
            password
        });

        // crear una URL de confirmar
        const confirmaUrl = `http://${req.headers.host}/confirmar/${email}`;
        // crear el objeto de usuario
        const usuario = {
            email
        }
        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmaUrl,
            archivo: 'confirmar-cuenta'
        });

        // redirirgir al usuario
        req.flash('correcto','Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        
        req.flash('error',error.errors.map(error => error.message));
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask',
            email,
            password
        });
    }

};

const formRestablecerPassword = (req,res) => {
    res.render('restablecer',{
        nombrePagina: 'Restablecer tu Contraseña'
    });
};

const confirmarCuenta = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.email
        }
    })

    if(!usuario){
        req.flash('error','No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto','Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}


module.exports= {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    formRestablecerPassword,
    confirmarCuenta
}