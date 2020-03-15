const express = require('express');
const router = express.Router();

// Importar express validator
const {body} = require('express-validator');

// Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
module.exports = function() {
    // ruta para el home
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    // Proyectos

    // Acciones para crear un nuevo proyecto
    // ruta para ingresar nuevo proyecto
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    // ruta que redirecciona luego de enviar el nuevo proyecto
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').notEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar Proyecto y sus tareas
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Acciones para eliminar un proyecto
    // Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').notEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // Eliminar un proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // Tareas

    // Enviar las tareas a la bd
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
    
    // Actualizar tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // Crear nueva cuenta
    router.get('/crear-cuenta',usuariosController.formCrearCuenta); //vista del formualrio
    router.post('/crear-cuenta',usuariosController.crearCuenta); //envia los datos a guardar
    router.get('/confirmar/:email',usuariosController.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario);

    // cerrar-sesion
    router.get('/cerrar-sesion',authController.cerrarSesion);

    // reestablecer contraseña
    router.get('/restablecer',usuariosController.formRestablecerPassword);
    router.post('/restablecer',authController.enviarToken);

    router.get('/restablecer/:token',authController.validarToken);
    router.post('/restablecer/:token',authController.actualizarPassword);

    return router;
    
}