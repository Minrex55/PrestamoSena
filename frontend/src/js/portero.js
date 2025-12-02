document.addEventListener('DOMContentLoaded', () => {
    
    // VARIABLE GLOBAL PARA ALMACENAR LOS EQUIPOS
    let listaEquiposGlobal = [];

    // --- INICIALIZACIÓN ---
    cargarEquipos();

    // 1. LÓGICA DEL SIDEBAR
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnPorteros = document.getElementById('btn-porteros'); 

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

    if(btnPorteros){
        btnPorteros.addEventListener('click', (e) => {
            cargarEquipos();
        });
    }

    // 2. LÓGICA DE PREVISUALIZACIÓN DE IMÁGENES (Tu código original)
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');

    if(dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drop-zone--over');
        });

        ['dragleave', 'dragend'].forEach(type => {
            dropZone.addEventListener(type, () => dropZone.classList.remove('drop-zone--over'));
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
            if (fileInput.files.length) updateThumbnail(fileInput.files);
        });
    }

    function updateThumbnail(files) {
        if(!previewContainer) return;
        previewContainer.innerHTML = "";
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

    // 3. FORMULARIO DE REGISTRO
    const pcForm = document.getElementById('pcForm');
    if(pcForm) {
        pcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Aquí iría tu fetch POST real...
            alert(`Simulación: Equipo registrado.`);
            pcForm.reset();
            if(previewContainer) previewContainer.innerHTML = "";
            cargarEquipos();
        });
    }

    // ==========================================
    // 4. LÓGICA DE BÚSQUEDA (NUEVO)
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            
            // Si el campo está vacío, mostramos todos
            if (texto === "") {
                renderizarTabla(listaEquiposGlobal);
                return;
            }

            // Filtramos por Modelo O por Serial
            const equiposFiltrados = listaEquiposGlobal.filter(equipo => {
                const modelo = (equipo.modelo || "").toLowerCase();
                const serial = (equipo.numerodeserie || "").toLowerCase();
                
                return modelo.includes(texto) || serial.includes(texto);
            });

            renderizarTabla(equiposFiltrados);
        });
    }

    // ==========================================
    // 5. OBTENER DATOS DEL BACKEND
    // ==========================================
    async function cargarEquipos() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/portero/equipo/buscar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                alert('Tu sesión ha expirado.');
                localStorage.removeItem('token');
                window.location.href = 'index.html';
                return;
            }

            const data = await response.json();
            
            if (data.equiposObtenidos && data.equiposObtenidos.length > 0) {
                // Guardamos los datos en la variable global
                listaEquiposGlobal = data.equiposObtenidos;
                // Dibujamos la tabla inicial
                renderizarTabla(listaEquiposGlobal);
            } else {
                listaEquiposGlobal = [];
                renderizarTabla([]);
            }

        } catch (error) {
            console.error("Error cargando equipos:", error);
            const tbody = document.querySelector('.sena-table tbody');
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error de conexión.</td></tr>';
        }
    }

    // ==========================================
    // 6. RENDERIZAR TABLA (NUEVO - REUTILIZABLE)
    // ==========================================
    function renderizarTabla(listaEquipos) {
        const tbody = document.querySelector('.sena-table tbody');
        tbody.innerHTML = ''; // Limpiar tabla actual

        if (listaEquipos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No se encontraron equipos.</td></tr>';
            return;
        }

        listaEquipos.forEach(equipo => {
            const row = document.createElement('tr');
            
            // OBTENER ID (Asegúrate que tu DB devuelve _id o idequipo)
            const idEquipo = equipo.idequipo || equipo._id;

            row.innerHTML = `
                <td>${equipo.modelo || 'Sin Modelo'}</td>
                <td>${equipo.numerodeserie || 'Sin Serial'}</td>
                <td>${equipo.idinvitado || 'No asignado'}</td>
                <td><span class="status-badge status-active">Activo</span></td>
                <td>
                    <div class="action-buttons">
                        <!-- Aquí se inyecta el ID en la función onclick -->
                        <button class="btn-edit" onclick="editarEquipo('${idEquipo}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="eliminarEquipo('${idEquipo}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Exportar para uso global si es necesario
    window.cargarEquiposGlobal = cargarEquipos; 
});

// --- FUNCIONES GLOBALES ---

window.eliminarEquipo = async (id) => {
    if(!confirm('¿Estás seguro de que deseas eliminar este equipo?')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3333/portero/equipo/eliminar/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Equipo eliminado correctamente.');
            // Recargamos la lista completa del servidor
            if(window.cargarEquiposGlobal) window.cargarEquiposGlobal(); 
        } else {
            const data = await response.json();
            alert('Error: ' + (data.mensaje || 'No se pudo eliminar'));
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
};

window.editarEquipo = (id) => {
    // 1. Aquí capturas el ID para editar.
    console.log("ID capturado para editar:", id);
    
    // 2. Puedes redirigir pasando el ID en la URL
    // window.location.href = `porteroeditar.html?id=${id}`;
    
    // O guardar en localStorage temporalmente si usas un modal en la misma página
    // localStorage.setItem('equipoEditarId', id);
    
    alert(`Listo para editar el equipo con ID: ${id}`);
};