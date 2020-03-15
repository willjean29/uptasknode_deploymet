import axios from 'axios';
import Swal from 'sweetalert2';

const btnEliminar = document.getElementById('eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        const id = e.target.dataset.proyectoId;
        console.log(id);
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
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                let datos = {
                    url: urlProyecto,
                    id: id
                };
                console.log(datos);
                axios.delete(url,{params: datos})
                    .then((respuesta) => {
                        console.log(respuesta);

                        Swal.fire(
                            'Proyecto Eliminado',
                            respuesta.data,
                            'success'
                        )
                        setTimeout(() => {
                            window.location.href='/';
                        }, 3000);
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Hubo un Error',
                            'No se pudo eliminar el proyecto',
                            'error'
                        )
                    });


            }
    

          })
    });
}

const formProyecto = document.querySelector('.agregar-proyecto');
if(formProyecto){
    formProyecto.addEventListener('submit',agregarProyecto);
    function agregarProyecto(e){
        let url = '/nuevo-proyecto';
        const datos = new FormData(formProyecto);
        const nombre = datos.get('nombre');
        if(nombre){
            e.preventDefault();
        }
        const btnEnviar =document.querySelector('input.boton');
        const dataId = btnEnviar.dataset.proyectoId;
        console.log(btnEnviar);
        console.log(dataId)
        if(dataId != ''){
            url=`/nuevo-proyecto/${dataId}`;
            console.log('no vacio');
        }
        axios.post(url,{nombre: nombre,url:'datos'})
            .then((respuesta) => {
                if(respuesta.data.respuesta == 'exito'){
                    Swal.fire({
                        title: 'Proyecto Agregado',
                        text: 'El Proyecto se agrego con exito',
                        icon: 'success',
                        timer: 1500
                    })
                    
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Hubo un error',
                    text: 'No se pudo agregar el proyecto',
                    icon: 'error',
                    timer: 1500
                })
            });
    }
}

export default btnEliminar;