const Proyectos = require('../models/Proyecto');
const Tareas = require('../models/Tarea');
const slug = require('slug');
const proyectosHome = async (req,res) => {
    // console.log(res.locals.usuario.id);
    const usuarioId = res.locals.usuario.id;
    const proyectos =  await Proyectos.findAll({where : {usuarioId}});
    res.render('index',{
        nombrePagina : 'Proyectos',
        proyectos
    });
};

const formularioProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos =  await Proyectos.findAll({where : {usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
};

const nuevoProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos =  await Proyectos.findAll({where : {usuarioId}});
    const {nombre} = req.body;
    console.log(req.body);
    let errores = [];

    if(!nombre){
        errores.push({'texto' : 'Agregar un Nombre al Proyecto'});
    }
    
    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }else{
        // No hay errores 
        // Insertar en la BD
        const usuarioId = res.locals.usuario.id;
        const proyecto = await Proyectos.create({nombre,usuarioId});
        res.send({
            nombre,
            respuesta: 'exito'
        });
    }
};

const proyectoPorUrl = async (req,res,next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =  await Proyectos.findAll({where : {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    // Consultar las tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        }
    })

    if(proyecto == null) return next();

    // render a la vista
    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
};

const formularioEditar = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where : {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
    // render a la vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
};

const actualizarProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos =  await Proyectos.findAll({where : {usuarioId}});
    const {nombre} = req.body;
    console.log("actualizando proyecto")
    let errores = [];

    if(!nombre){
        errores.push({'texto' : 'Agregar un Nombre al Proyecto'});
    }
    
    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }else{
        // No hay errores 
        // Insertar en la BD
        const proyecto = await Proyectos.update(
            {nombre: nombre},
            {
                where: {
                    id: req.params.id
                },
                individualHooks:true
            }
            
        );
        res.send({
            respuesta: 'exito'
        });
    }
    
};

const eliminarProyecto = async (req,res,next) => {

    const {url,id} = req.query;

    const proyecto = await Proyectos.destroy({where:{url: url}});

    if(!proyecto){
        return next();
    }

    res.send('Proyecto Elimnado Correctamente');
};


module.exports = {
    proyectosHome,
    formularioProyecto,
    nuevoProyecto,
    proyectoPorUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
}