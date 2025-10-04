
// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', (event) => {

    // Inicializa el visor de OpenSeadragon
const channel = new BroadcastChannel('actualizar_marcadores');
    const viewer = OpenSeadragon({
        id: "viewer2",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../image/lunas/luneta_cuatro.dzi", // Tu archivo DZI aquí
        showNavigator: true,
        defaultZoomLevel: 0,
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
        visibilityRatio: 1.0,
        constrainDuringPan: false,
        zoomPerScroll: 1.3,
        gestureSettingsMouse: {
            clickToZoom: false,
            dblClickToZoom: false,
            scrollToZoom: true
        }
    });
//
    // Función para cambiar la imagen del visor
    window.cambiarImagenVisor2 = function(fecha) {
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



        function saveTags(tags) {
        localStorage.setItem('tags', JSON.stringify(tags));

        channel.postMessage('update'); 
        console.log('Script 2: Mensaje de actualización enviado.');
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
        const list = document.getElementById('tag-list2');
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
        
        const list = document.getElementById('tag-list2');
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
        console.log('Script 2: ¡Mensaje recibido! Actualizando...');
        
        // Si el mensaje es 'update', recargamos los marcadores.
        if (event.data === 'update') {
            loadTags(); // Llama a la función loadTags() de ESTE script (smfc2.js).
        }
    };

    // Añade un manejador de eventos para el clic en el canvas
    /*viewer.addHandler('canvas-click', function(event) {
        // Pide al usuario un comentario sobre el punto
        let comment = prompt("¿Qué has encontrado? (Ej: Posible supernova, galaxia espiral)");

        if (comment) { // Si el usuario no cancela el prompt
            // Convierte las coordenadas del clic a coordenadas de la imagen
            let viewportPoint = viewer.viewport.pointFromPixel(event.position);

            // Crea un objeto para guardar la etiqueta
            let newTag = {
                x: viewportPoint.x,
                y: viewportPoint.y,
                text: comment
            };
            
            // Guarda y dibuja la nueva etiqueta
            saveTag(newTag);
            drawTag(newTag);
        }
    });

    // Función para guardar una etiqueta en el localStorage
    function saveTag(tag) {
        // Obtenemos las etiquetas existentes o creamos un array vacío
        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        // Añadimos la nueva etiqueta
        tags.push(tag);
        // Guardamos el array actualizado en localStorage
        localStorage.setItem('tags', JSON.stringify(tags));
    }

    // Función para dibujar una etiqueta en el visor y en la lista
    function drawTag(tag) {
        // Crea un elemento DIV para el overlay en la imagen
        const tagElement = document.createElement("div");
        tagElement.className = "tag"; // Así puedes darle estilo con CSS
        tagElement.title = tag.text; // Muestra el comentario al pasar el mouse
        
        // Estilos básicos (es mejor hacerlo en un archivo CSS)
        tagElement.style.width = "10px";
        tagElement.style.height = "10px";
        tagElement.style.backgroundColor = "red";
        tagElement.style.borderRadius = "50%";
        tagElement.style.cursor = "pointer";

        // Usa el sistema de overlays de OpenSeadragon para colocar el DIV
        viewer.addOverlay({
            element: tagElement,
            location: new OpenSeadragon.Point(tag.x, tag.y)
        });

        // Añade la etiqueta a la lista de la barra lateral
        const list = document.getElementById('tag-list2');
        const listItem = document.createElement('li');
        listItem.textContent = tag.text;
        listItem.style.cursor = "pointer";
        listItem.onclick = function() {
            // Centra la vista en la etiqueta al hacer clic en la lista
            viewer.viewport.panTo(new OpenSeadragon.Point(tag.x, tag.y));
            viewer.viewport.zoomTo(5); // Ajusta el nivel de zoom como desees
        };
        list.appendChild(listItem);
    }

    // Carga todas las etiquetas guardadas del localStorage
    function loadTags() {
        const list = document.getElementById('tag-list2');
        if (list) {
            list.innerHTML = ''; // Limpia la lista actual para evitar duplicados
        }
        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.forEach(tag => {
            drawTag(tag);
        });
    }

    // Llama a loadTags() cuando el visor esté listo y la imagen se haya abierto
    viewer.addHandler('open', function() {
        loadTags();
    });
*/
});