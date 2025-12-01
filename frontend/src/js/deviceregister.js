document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LÓGICA DEL SIDEBAR (Misma consistencia)
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if(menuBtn) {
        menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    }
    if(overlay) {
        overlay.addEventListener('click', () => { if(sidebar.classList.contains('active')) toggleMenu(); });
    }

    // 2. LÓGICA DE PREVISUALIZACIÓN DE IMÁGENES
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');

    // Hacer clic en la zona punteada activa el input file oculto
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Cambiar estilo al arrastrar archivos encima
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone--over');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => {
            dropZone.classList.remove('drop-zone--over');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone--over');

        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateThumbnail(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateThumbnail(fileInput.files);
        }
    });

    function updateThumbnail(files) {
        previewContainer.innerHTML = ""; // Limpiar vista previa anterior
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('preview-image');
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. VALIDACIÓN Y ENVÍO DEL FORMULARIO
    const pcForm = document.getElementById('pcForm');
    
    pcForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const serial = document.getElementById('serial').value;
        
        // Validación básica extra (aunque el HTML required ya ayuda)
        if(serial.length < 4) {
            alert("Por favor verifique el número de serial.");
            return;
        }

        // Simulación de éxito
        alert(`EQUIPO REGISTRADO CON ÉXITO\n\nMarca: ${marca}\nModelo: ${modelo}\nSerial: ${serial.toUpperCase()}`);
        
        // Limpiar formulario
        pcForm.reset();
        previewContainer.innerHTML = "";
    });
});