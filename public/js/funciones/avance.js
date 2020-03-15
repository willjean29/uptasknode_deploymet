import Swal from 'sweetalert2';
export const actualizarAvance = () => {
    // Seleccionar las tareas existentes
    const tareas = document.querySelectorAll('.tarea');

    if(tareas.length){
        // Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
        
        // calcular avance
        const avance = Math.round((tareasCompletas.length/tareas.length)*100);

        // mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance == 100){
            // Alerta
            Swal.fire({
                title: 'Completaste el Proyecto',
                text : 'Felicidades has terminado tus tareas',
                icon: 'success',
                timer: 1500
            })           
        }
    }

}