const channel = new BroadcastChannel('actualizar_marcadores');
// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', (event) => {
    
    // 1. INICIALIZA EL VISOR DE OPENSEADRAGON
    // ------------------------------------------
    const viewer = OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../image/lunas/luneta_dos.dzi", // <-- Asegúrate que esta ruta sea correcta
        
        // --- Opciones de visualización ---
        showNavigator: true,
        defaultZoomLevel: 0, // Inicia con la imagen lo más alejada posible
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
        visibilityRatio: 1.0,
        constrainDuringPan: false,
        zoomPerScroll: 1.3,
        
        // --- Opciones de los botones de control ---
        gestureSettingsMouse: {
            clickToZoom: false,
            dblClickToZoom: false,
            scrollToZoom: true
        }
    });


    // Función para cambiar la imagen del visor
    window.cambiarImagenVisor1 = function(fecha) {
        // Mapeo de fechas a archivos DZI
        const mapaFechasImagenes = {
            '2024-02-24': '../image/lunas/luneta_dos.dzi',
            '2003-10-18': '../image/lunas/luneta_tres.dzi',
            '2003-11-17': '../image/lunas/luneta_cuatro.dzi',
            '2013-10-15': '../image/lunas/luneta_cinco.dzi',
            '2024-12-15': '../image/lunas/luneta_seis.dzi',
            '2024-12-20': '../image/lunas/luneta_siete.dzi',
        };
     const rutaImagen = mapaFechasImagenes[fecha];
        
        if (rutaImagen) {
            // Abre la nueva imagen en el visor
            viewer.open(rutaImagen);
            console.log('Imagen cambiada a:', rutaImagen);
        } else {
            console.warn('No hay imagen disponible para la fecha:', fecha);
            alert('No hay imagen disponible para la fecha seleccionada');
        }
    };

    // 2. FUNCIONES PARA MANEJAR MARCADORES
    // ------------------------------------

    // Guarda la lista completa de marcadores en la memoria del navegador
    function saveTags(tags) {
        localStorage.setItem('tags', JSON.stringify(tags));
        channel.postMessage('update');
        console.log('Script 1: Mensaje de actualización enviado.');
    }

    // Dibuja un marcador en la imagen y en la lista lateral
    function drawTag(tag, index) {
        // --- A. Dibuja el punto rojo en la imagen (Overlay) ---
        const tagElement = document.createElement("div");
        tagElement.className = "tag";
        tagElement.title = tag.text;
        tagElement.style.width = "10px";
        tagElement.style.height = "10px";
        tagElement.style.backgroundColor = "red";
        tagElement.style.borderRadius = "50%";
        tagElement.style.cursor = "pointer";
        viewer.addOverlay({
            element: tagElement,
            location: new OpenSeadragon.Point(tag.x, tag.y)
        });

        // --- B. Crea el elemento en la lista lateral ---
        const list = document.getElementById('tag-list');
        const listItem = document.createElement('li');

        // El texto del marcador, que al hacer clic te lleva al punto
        const textSpan = document.createElement('span');
        textSpan.textContent = tag.text;
        textSpan.style.cursor = "pointer";
        textSpan.onclick = function() {
            viewer.viewport.panTo(new OpenSeadragon.Point(tag.x, tag.y));
            viewer.viewport.zoomTo(5);
        };

        // El botón para borrar el marcador
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function() {
            deleteTag(index);
        };

        listItem.appendChild(textSpan);
        listItem.appendChild(deleteBtn);
        list.appendChild(listItem);
    }
    
    // Borra un marcador específico
    function deleteTag(index) {
        if (!confirm('¿Estás seguro de que quieres borrar este marcador?')) {
            return;
        }
        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.splice(index, 1); // Elimina el elemento en la posición 'index'
        saveTags(tags); // Guarda la nueva lista (sin el elemento borrado)
        loadTags(); // Recarga la vista para reflejar el cambio
    }

    // Carga todos los marcadores guardados al iniciar y al hacer cambios
    function loadTags() {
        viewer.clearOverlays(); // Limpia los puntos rojos de la imagen antes de volver a dibujar
        
        const list = document.getElementById('tag-list');
        if (list) {
            list.innerHTML = ''; // Limpia la lista de texto
        }

        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.forEach((tag, index) => {
            drawTag(tag, index);
        });
    }


    // 3. MANEJADORES DE EVENTOS
    // ---------------------------

    // Evento para AÑADIR un nuevo marcador al hacer clic
    viewer.addHandler('canvas-double-click', function(event) {
        let comment = prompt("¿Qué has encontrado? (Ej: Cráter Tycho)");

        if (comment && comment.trim() !== '') { // Si el usuario escribe algo
            let viewportPoint = viewer.viewport.pointFromPixel(event.position);
            
            let newTag = {
                x: viewportPoint.x,
                y: viewportPoint.y,
                text: comment
            };
            
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            tags.push(newTag); // Añade el nuevo marcador a la lista
            saveTags(tags);    // Guarda la lista actualizada
            loadTags();        // Recarga y muestra todo
        }
    });

    // Evento para CARGAR los marcadores existentes cuando el visor esté listo
    viewer.addHandler('open', function() {
        loadTags();
    });

    channel.onmessage = function(event) {
        console.log('Script 1: ¡Mensaje recibido! Actualizando...');
        if (event.data === 'update') {
            loadTags(); // Llama a su PROPIA función loadTags
        }
    };

});