// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', (event) => {

    // Inicializa el visor de OpenSeadragon

    const viewer = OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../image/lunas/luneta_dos.dzi", // Tu archivo DZI aquí
        showNavigator: true,
        defaultZoomLevel: 0,
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
        visibilityRatio: 1.0,
        constrainDuringPan: false,
        zoomPerScroll: 1.3,
        gestureSettingsMouse: {
            clickToZoom: true,
            dblClickToZoom: true,
            scrollToZoom: true
        }
    });

    

    // Añade un manejador de eventos para el clic en el canvas
    viewer.addHandler('canvas-click', function(event) {
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
        const list = document.getElementById('tag-list');
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
        const list = document.getElementById('tag-list');
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

});