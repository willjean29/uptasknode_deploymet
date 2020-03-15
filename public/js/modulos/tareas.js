import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click',(e) => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            console.log(idTarea);

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url,{idTarea})
                .then((respuesta) => {
                    if(respuesta.status == 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tarea = e.target.parentElement.parentElement;
            const idTarea = tarea.dataset.tarea;

            Swal.fire({
                title: '¿Deseas borrar este proyecto?',
                text: "Un proyecto eliminado no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
              }).then((result) => {
                if (result.value) {

                    const url = `${location.origin}/tareas/${idTarea}`;

                    console.log('Eliminando..........');

                    // Enviar el delet por medio de axios
                    axios.delete(url,{idTarea})
                        .then((respuesta) => {
                            console.log(respuesta);
                            if(respuesta.status == 200){
                                // eliminar tarea del DOM
                                tarea.remove();

                                // Alerta
                                Swal.fire({
                                    title: 'Tarea Eliminada',
                                    text : respuesta.data,
                                    icon: 'success',
                                    timer: 1500
                                })

                                actualizarAvance();
                            }
                        })
                }
              })
            
        }

    })
}

const formAgregarTarea = document.querySelector('.agregar-tarea');
if(formAgregarTarea){
    formAgregarTarea.addEventListener('submit',agregar);
    function agregar(e){
        e.preventDefault(); 
        console.log('hola');
        const btnEnviar = document.querySelector('.nueva-tarea');
        const urlProyecto = btnEnviar.dataset.proyectoUrl;
        console.log(urlProyecto);
        const url = `/proyectos/${urlProyecto}`;
        const datos = new FormData(formAgregarTarea);
        const tarea = datos.get('tarea');

        axios.post(url,{tarea:tarea})
            .then((respuesta) => {
                console.log(respuesta.data);
                const resp = respuesta.data;
                if(resp.errores){
                    const contenido = document.querySelector('.contenido-principal');
                    const div = document.createElement('div');
                    div.innerHTML = resp.errores[0].texto;
                    div.classList.add('alerta','error');
                    contenido.insertBefore(div,this);
                    setTimeout(() => {
                        div.remove();
                    }, 3000);
                }else{
                    console.log(respuesta.data.tareas);
                    const tareas = respuesta.data.tareas;
                    console.log(tarea);
                    let tareaInsertada = tareas.find(tareas => tareas.tarea == tarea);
                    console.log(tareaInsertada);
                    Swal.fire({
                        title: 'Tarea Agregada',
                        text: 'La Tarea se agrego con exito',
                        icon: 'success',
                        timer: 1500
                    })
                    const listaTareas = document.querySelector('.listado-pendientes ul');
                    const li = document.createElement('li');
                    li.classList.add('tarea');
                    li.setAttribute('data-tarea',tareaInsertada.id);
                    let template = `
                        <p>${tarea}</p>
                        <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>
                        </div>
                    `;
                    li.innerHTML = template;
                    listaTareas.appendChild(li);
                    formAgregarTarea.reset();
                }
            })
            .catch((error) =>{
                Swal.fire({
                    title: 'Hubo un error',
                    text: 'No se pudo agregar la tarea',
                    icon: 'error',
                    timer: 1500
                })
            });
    }
}

export default tareas;