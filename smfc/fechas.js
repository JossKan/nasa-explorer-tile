// ============================================
// MANEJO DE SELECTORES DE FECHA
// ============================================

// Elementos de fecha
const fechaIzq = document.getElementById('fecha-izq');
const fechaDer = document.getElementById('fecha-der');
const displayIzq = document.getElementById('display-izq');
const displayDer = document.getElementById('display-der');


// Botones de confirmación
const btnConfirmarIzq = document.getElementById('btn-confirmar-izq');
const btnConfirmarDer = document.getElementById('btn-confirmar-der');

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
        btnConfirmarIzq.disabled = false;
    } else {
        displayIzq.value = '';
        btnConfirmarIzq.disabled = true;
    }
});

// Evento para fecha derecha 
fechaDer.addEventListener('change', (e) => {
    const fechaSeleccionada = e.target.value;
    
    if (fechaSeleccionada) {
        displayDer.value = formatearFecha(fechaSeleccionada);
        btnConfirmarDer.disabled = false;
    } else {
        displayDer.value = '';
        btnConfirmarDer.disabled = true;
    }
});

// Evento para botón confirmar izquierdo
btnConfirmarIzq.addEventListener('click', () => {
    const fechaSeleccionada = fechaIzq.value;
    
    if (!fechaSeleccionada) {
        alert('Por favor selecciona una fecha primero');
        return;
    }
    
    if (!validarFechasDiferentes(fechaSeleccionada, fechaDer.value)) {
        fechaIzq.value = '';
        displayIzq.value = '';
        btnConfirmarIzq.disabled = true;
        return;
    }

// Cambia la imagen del visor izquierdo
    if (typeof window.cambiarImagenVisor1 === 'function') {
        window.cambiarImagenVisor1(fechaSeleccionada);
        // Feedback visual
        btnConfirmarIzq.textContent = '✓ Confirmado';
        setTimeout(() => {
            btnConfirmarIzq.textContent = '🚀Confirmar';
        }, 2000);
    } else {
        alert('El visor aún no está listo. Intenta de nuevo.');
    }
});

// Evento para botón confirmar derecho
btnConfirmarDer.addEventListener('click', () => {
    const fechaSeleccionada = fechaDer.value;
    
    if (!fechaSeleccionada) {
        alert('Por favor selecciona una fecha primero');
        return;
    }
    
    if (!validarFechasDiferentes(fechaSeleccionada, fechaIzq.value)) {
        fechaDer.value = '';
        displayDer.value = '';
        btnConfirmarDer.disabled = true;
        return;
    }
    
    // Cambia la imagen del visor derecho
    if (typeof window.cambiarImagenVisor2 === 'function') {
        window.cambiarImagenVisor2(fechaSeleccionada);
        // Feedback visual
        btnConfirmarDer.textContent = '✓ Confirmado';
        setTimeout(() => {
            btnConfirmarDer.textContent = '🚀Confirmar';
        }, 2000);
    } else {
        alert('El visor aún no está listo. Intenta de nuevo.');
    }
});

// Deshabilitar botones inicialmente
btnConfirmarIzq.disabled = true;
btnConfirmarDer.disabled = true;

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