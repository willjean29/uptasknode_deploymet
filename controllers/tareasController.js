const Tareas = require('../models/Tarea');
const Proyectos = require('../models/Proyecto');


const agregarTarea = async (req,res,next) => {
    const proyectos = await Proyectos.findOne({where: {url: req.params.url}});
    // leer el valor del input
    const {tarea} = req.body;

    // estado 0 = incompleto / estado 1 = completo
    const estado = 0;
    const proyectoId = proyectos.id;

    let errores = [];

    if(!tarea){
        errores.push({ texto: 'Agregar una tarea para el proyecto'});
    }

    if(errores.length > 0){
        res.send({
            errores
        });
    }else{
        const resultado = await Tareas.create({tarea, estado, proyectoId});
        if(!resultado){
            return next();
        }
        const tareas = await Tareas.findAll({where : { proyectoId: proyectoId}});
        res.send({
            respuesta: 'exito',
            tareas
        });
    }

}

const cambiarEstadoTarea = async (req,res,next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: {id: id}});

    // cambiar el estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();

    if(!resultado) return next();
    res.send('Actuaizado');
}

const eliminarTarea = async (req,res,next) => {
    const {id} = req.params;
    
    // Eliminar la tarea
    const resultado = await Tareas.destroy({where: {id: id}});
    if(!resultado) return next();
    res.send('Tarea eliminada correctamente');
}
    

module.exports = {
    agregarTarea,
    cambiarEstadoTarea,
    eliminarTarea
}