// Elementos del DOM
const btnToggle = document.getElementById('btn-toggle');
const btnCerrar = document.getElementById('btn-cerrar');
const menuLateral = document.getElementById('menu-lateral');
const overlay = document.getElementById('overlay');

// Función para abrir el menú
function abrirMenu() {
    menuLateral.classList.remove('cerrado');
    overlay.classList.add('activo');
    btnToggle.classList.add('activo');
}

// Función para cerrar el menú
function cerrarMenu() {
    menuLateral.classList.add('cerrado');
    overlay.classList.remove('activo');
    btnToggle.classList.remove('activo');
}

// Event listeners
btnToggle.addEventListener('click', () => {
    if (menuLateral.classList.contains('cerrado')) {
        abrirMenu();
    } else {
        cerrarMenu();
    }
});

btnCerrar.addEventListener('click', cerrarMenu);
overlay.addEventListener('click', cerrarMenu);

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menuLateral.classList.contains('cerrado')) {
        cerrarMenu();
    }
});