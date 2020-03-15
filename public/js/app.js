import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avance';

document.addEventListener('DOMContentLoaded',() => {
    actualizarAvance();
    
});

// menu movil
const menu = document.querySelector('.menu-bars');
if(menu){
    menu.addEventListener('click',(e) => {
        console.log('hola');
        const proyectos = document.querySelector('.contenedor-proyectos');
        proyectos.classList.toggle('oculto');
    });

    setInterval(() => {
        if(window.innerWidth>800){
            const proyectos = document.querySelector('.contenedor-proyectos');
            proyectos.classList.remove('oculto');
        }
    }, 100);
}

