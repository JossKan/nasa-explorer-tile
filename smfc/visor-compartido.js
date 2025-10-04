document.addEventListener('DOMContentLoaded', function() {

    // Array para guardar nuestras instancias de visores
    const viewers = [];

    // --- 1. INICIALIZACIÓN DE AMBOS VISORES ---
    const viewer1 = OpenSeadragon({
        id: "viewer1",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../image/lunas/luneta_dos.dzi"
    });
    viewers.push(viewer1); // Añadimos el primer visor a nuestra lista

    const viewer2 = OpenSeadragon({
        id: "viewer2",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../image/lunas/luneta_cuatro.dzi" // Puede ser la misma imagen o una diferente
    });
    viewers.push(viewer2); // Añadimos el segundo visor a nuestra lista

    // --- 2. FUNCIONES DE MARCADORES QUE AFECTAN A AMBOS VISORES ---

    function saveTags(tags) {
        // Solo hay un lugar para guardar: 'tags'
        localStorage.setItem('tags', JSON.stringify(tags));
    }

    function drawTag(tag, index) {
        // A. Dibuja el overlay en CADA visor de nuestra lista
        viewers.forEach(viewer => {
            const tagElement = document.createElement("div");
            tagElement.className = "tag";
            tagElement.title = tag.text;
            tagElement.style.cssText = "width:10px; height:10px; background-color:red; border-radius:50%; cursor:pointer;";
            viewer.addOverlay({
                element: tagElement,
                location: new OpenSeadragon.Point(tag.x, tag.y)
            });
        });

        // B. Crea UN solo elemento en la lista compartida
        const list = document.getElementById('tag-list');
        const listItem = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.textContent = tag.text;
        textSpan.style.cursor = "pointer";
        textSpan.onclick = function() {
            // Al hacer clic, le da la orden a CADA visor
            viewers.forEach(viewer => {
                viewer.viewport.panTo(new OpenSeadragon.Point(tag.x, tag.y));
                viewer.viewport.zoomTo(5);
            });
        };

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

    function deleteTag(index) {
        if (!confirm('¿Seguro que quieres borrar este marcador?')) return;
        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.splice(index, 1);
        saveTags(tags);
        loadTags(); // loadTags ya actualiza ambos visores
    }

    function loadTags() {
        // Limpia los overlays en CADA visor
        viewers.forEach(viewer => viewer.clearOverlays());

        // Limpia la lista compartida
        const list = document.getElementById('tag-list');
        if (list) list.innerHTML = '';
        
        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.forEach((tag, index) => {
            drawTag(tag, index);
        });
    }

    // --- 3. ASIGNAR EVENTOS A AMBOS VISORES ---
    viewers.forEach(viewer => {
        // Evento para AÑADIR un marcador (funciona en cualquiera de los dos visores)
        viewer.addHandler('canvas-double-click', function(event) {
            let comment = prompt("Añadir marcador:", "");
            if (comment && comment.trim() !== '') {
                let viewportPoint = viewer.viewport.pointFromPixel(event.position);
                let newTag = { x: viewportPoint.x, y: viewportPoint.y, text: comment };
                let tags = JSON.parse(localStorage.getItem('tags')) || [];
                tags.push(newTag);
                saveTags(tags);
                loadTags(); // Recarga y sincroniza ambos visores
            }
        });

        // Carga los marcadores cuando el visor esté listo
        viewer.addHandler('open', loadTags);
    });
});