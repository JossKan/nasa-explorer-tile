// Base de datos de fases lunares (ejemplo con algunas fechas)
const fasesLunares = {
    llena: [
        { fecha: '2024-01-25', texto: '25 de enero de 2024' },
        { fecha: '2024-02-24', texto: '24 de febrero de 2024' },
        { fecha: '2024-03-25', texto: '25 de marzo de 2024' },
        { fecha: '2024-04-23', texto: '23 de abril de 2024' },
        { fecha: '2024-12-15', texto: '15 de diciembre de 2024' }
    ],
    nueva: [
        { fecha: '2024-01-11', texto: '11 de enero de 2024' },
        { fecha: '2024-02-09', texto: '9 de febrero de 2024' },
        { fecha: '2024-03-10', texto: '10 de marzo de 2024' }
    ],
    creciente: [
        { fecha: '2024-01-17', texto: '17 de enero de 2024' },
        { fecha: '2024-02-16', texto: '16 de febrero de 2024' }
    ],
    menguante: [
        { fecha: '2024-01-04', texto: '4 de enero de 2024' },
        { fecha: '2024-02-02', texto: '2 de febrero de 2024' }
    ]
};

// Manejar clicks en botones de fase
document.querySelectorAll('.btn-fase').forEach(btn => {
    btn.addEventListener('click', function() {
        const fase = this.dataset.fase;
        const visor = this.dataset.visor;
        const dropdown = document.getElementById(`dropdown-fechas-${visor}`);
        const select = document.getElementById(`select-fechas-${visor}`);
        
        // Remover clase activo de todos los botones del mismo visor
        document.querySelectorAll(`[data-visor="${visor}"]`).forEach(b => {
            b.classList.remove('activo');
        });
        
        // Activar este botón
        this.classList.add('activo');
        
        // Llenar el dropdown con fechas de esta fase
        select.innerHTML = '<option value="">Selecciona una fecha de esta fase</option>';
        fasesLunares[fase].forEach(item => {
            const option = document.createElement('option');
            option.value = item.fecha;
            option.textContent = item.texto;
            select.appendChild(option);
        });
        
        // Mostrar dropdown
        dropdown.classList.remove('oculto');
    });
});

// Manejar selección de fecha del dropdown
document.getElementById('select-fechas-izq').addEventListener('change', function() {
    if (this.value) {
        document.getElementById('fecha-izq').value = this.value;
        document.getElementById('fecha-izq').dispatchEvent(new Event('change'));
    }
});

document.getElementById('select-fechas-der').addEventListener('change', function() {
    if (this.value) {
        document.getElementById('fecha-der').value = this.value;
        document.getElementById('fecha-der').dispatchEvent(new Event('change'));
    }
});