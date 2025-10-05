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

// --- CONTROL DEL PANEL DE MARCADORES ---
const btnToggleMarcadores = document.getElementById('btn-toggle-marcadores');
const btnCerrarMarcadores = document.getElementById('btn-cerrar-marcadores');
const panelMarcadores = document.getElementById('panel-marcadores');

// Función para abrir el panel de marcadores
function abrirPanelMarcadores() {
    panelMarcadores.classList.remove('cerrado');
}

// Función para cerrar el panel de marcadores
function cerrarPanelMarcadores() {
    panelMarcadores.classList.add('cerrado');
}

// Event listeners para el panel de marcadores
if (btnToggleMarcadores) {
    btnToggleMarcadores.addEventListener('click', () => {
        if (panelMarcadores.classList.contains('cerrado')) {
            abrirPanelMarcadores();
        } else {
            cerrarPanelMarcadores();
        }
    });
}

if (btnCerrarMarcadores) {
    btnCerrarMarcadores.addEventListener('click', cerrarPanelMarcadores);
}

// Cerrar panel de marcadores con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panelMarcadores.classList.contains('cerrado')) {
        cerrarPanelMarcadores();
    }
});