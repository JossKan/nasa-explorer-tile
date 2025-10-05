// Archivo: smfc3.js

document.addEventListener('DOMContentLoaded', () => {

    // Ya NO necesitas el mapa de fechas ni la función aquí, 
    // porque usaremos la que ya existe en smfc1.js

    const mapaFechasParaNodos = {
        '2024-02-24': '../image/lunas/luneta_dos.dzi',
        '2003-10-18': '../image/lunas/luneta_tres.dzi',
        '2003-11-17': '../image/lunas/luneta_cuatro.dzi',
        '2013-10-15': '../image/lunas/luneta_cinco.dzi',
        '2024-12-15': '../image/lunas/luneta_seis.dzi',
        '2024-12-20': '../image/lunas/luneta_siete.dzi',
    };

    const container = document.getElementById('timeline-container-izq');
    const fechasDisponibles = Object.keys(mapaFechasParaNodos).sort((a, b) => {
        return new Date(a) - new Date(b); // Orden ascendente (más antigua primero)
    });

    fechasDisponibles.forEach(fechaISO => {
        const nodo = document.createElement('div');
        nodo.className = 'timeline-node';
        nodo.dataset.fecha = fechaISO;

        const fechaObj = new Date(fechaISO + 'T00:00:00');
        const diaMes = fechaObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const anio = fechaObj.getFullYear();

        nodo.innerHTML = `
            <div class="timeline-date">${diaMes}</div>
            <div class="timeline-year">${anio}</div>
        `;

        // --- ¡AQUÍ ESTÁ EL CAMBIO PRINCIPAL! ---
        nodo.addEventListener('click', () => {
            container.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('activo'));
            nodo.classList.add('activo');
            
            // Verificamos si la función GLOBAL existe antes de llamarla
            if (typeof window.cambiarImagenVisor1 === 'function') {
                // Llamamos a la función que está en smfc1.js
                window.cambiarImagenVisor1(fechaISO);
            } else {
                console.error('La función cambiarImagenVisor1 no se encuentra. Asegúrate de que smfc1.js se cargue primero.');
                alert('Error: No se pudo cambiar la imagen.');
            }
        });

        container.appendChild(nodo);
    });

    // Añade esta función a tu archivo smfc3.js

// Hacemos esta función GLOBAL para poder llamarla desde el script de descarga
window.obtenerTextoDelNodoActivo = function() {
    const nodoActivo = document.querySelector('.timeline-node.activo');
    if (nodoActivo) {
        const fecha = nodoActivo.querySelector('.timeline-date').textContent;
        const anio = nodoActivo.querySelector('.timeline-year').textContent;
        return `${fecha} ${anio}`; // Devuelve, por ejemplo, "15 oct 2013"
    }
    // Devuelve un texto por defecto si no hay ninguno activo
    return "Fecha no seleccionada"; 
};
});