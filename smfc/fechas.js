// ============================================
// MANEJO DE SELECTORES DE FECHA
// ============================================

// Elementos de fecha
const fechaIzq = document.getElementById('fecha-izq');
const fechaDer = document.getElementById('fecha-der');
const displayIzq = document.getElementById('display-izq');
const displayDer = document.getElementById('display-der');

// Formatear fecha a español legible
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO + 'T00:00:00'); // Evita problemas de zona horaria
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Validar que las fechas no sean iguales
function validarFechasDiferentes(fecha1, fecha2, inputActual, displayActual) {
    if (fecha1 === fecha2 && fecha1 !== '') {
        alert('Las fechas deben ser diferentes para comparar');
        inputActual.value = '';
        displayActual.value = '';
        return false;
    }
    return true;
}

// Evento para fecha izquierda
fechaIzq.addEventListener('change', (e) => {
    const fechaSeleccionada = e.target.value;
    
    if (fechaSeleccionada) {
        displayIzq.value = formatearFecha(fechaSeleccionada);
        validarFechasDiferentes(fechaSeleccionada, fechaDer.value, fechaIzq, displayIzq);
    } else {
        displayIzq.value = '';
    }
});

// Evento para fecha derecha
fechaDer.addEventListener('change', (e) => {
    const fechaSeleccionada = e.target.value;
    
    if (fechaSeleccionada) {
        displayDer.value = formatearFecha(fechaSeleccionada);
        validarFechasDiferentes(fechaSeleccionada, fechaIzq.value, fechaDer, displayDer);
    } else {
        displayDer.value = '';
    }
});

// Función para obtener las fechas seleccionadas (útil para después)
function obtenerFechasSeleccionadas() {
    return {
        izquierda: fechaIzq.value,
        derecha: fechaDer.value
    };
}

// Función para limpiar ambas fechas
function limpiarFechas() {
    fechaIzq.value = '';
    fechaDer.value = '';
    displayIzq.value = '';
    displayDer.value = '';
}