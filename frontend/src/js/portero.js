document.addEventListener('DOMContentLoaded', () => {
    
    // CONSTANTE DE COLOR
    const SENA_GREEN = '#018102';

    // VARIABLE GLOBAL PARA ALMACENAR LOS EQUIPOS
    let listaEquiposGlobal = [];

    // --- INICIALIZACIÓN ---
    cargarEquipos();

    // ---------------------------------------------------------
    // 1. LÓGICA DEL SIDEBAR Y CERRAR SESIÓN
    // ---------------------------------------------------------
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnPorteros = document.getElementById('btn-porteros'); 
    
    // Referencia al botón de cerrar sesión
    const btnLogout = document.querySelector('.logout-item');

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
            e.preventDefault();
            cargarEquipos();
        });
    }

    // *** NUEVO: Lógica de Cerrar Sesión con SweetAlert ***
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); // Evita la redirección inmediata
            
            Swal.fire({
                title: 'Cerrando sesión...',
                text: 'Guardando actividad...',
                timer: 1500, // Tiempo de espera
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                willClose: () => {
                    localStorage.clear(); // Borra el token y datos
                    window.location.href = 'login.html'; // Redirige
                }
            });
        });
    }

    // ---------------------------------------------------------
    // 2. LÓGICA DE PREVISUALIZACIÓN DE IMÁGENES
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 3. FORMULARIO DE REGISTRO
    // ---------------------------------------------------------
    const pcForm = document.getElementById('pcForm');
    if(pcForm) {
        pcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Aquí iría tu fetch POST real...
            
            Swal.fire({
                icon: 'success',
                title: '¡Equipo Registrado!',
                text: 'El equipo ha sido ingresado al sistema.',
                confirmButtonColor: SENA_GREEN,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                pcForm.reset();
                if(previewContainer) previewContainer.innerHTML = "";
                // Recargar la tabla
                cargarEquipos(); 
            });
        });
    }

    // ---------------------------------------------------------
    // 4. LÓGICA DE BÚSQUEDA
    // ---------------------------------------------------------
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            
            if (texto === "") {
                renderizarTabla(listaEquiposGlobal);
                return;
            }

            const equiposFiltrados = listaEquiposGlobal.filter(equipo => {
                const idinvitado = String(equipo.idinvitado || "").toLowerCase();
                const modelo = (equipo.modelo || "").toLowerCase();
                const serial = (equipo.numerodeserie || "").toLowerCase();
                
                return modelo.includes(texto) || serial.includes(texto) || idinvitado.includes(texto);
            });

            renderizarTabla(equiposFiltrados);
        });
    }

    // ---------------------------------------------------------
    // 5. OBTENER DATOS DEL BACKEND
    // ---------------------------------------------------------
    async function cargarEquipos() {
        const token = localStorage.getItem('token');
        const tbody = document.querySelector('.sena-table tbody');
        
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Loader dentro de la tabla
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Cargando equipos...</td></tr>';

        try {
            const response = await fetch('http://localhost:3333/portero/equipo/buscar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                // Alerta de sesión expirada
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión Expirada',
                    text: 'Por favor inicia sesión nuevamente.',
                    confirmButtonColor: SENA_GREEN
                }).then(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                });
                return;
            }

            const data = await response.json();
            
            if (data.equiposObtenidos && data.equiposObtenidos.length > 0) {
                listaEquiposGlobal = data.equiposObtenidos;
                renderizarTabla(listaEquiposGlobal);
            } else {
                listaEquiposGlobal = [];
                renderizarTabla([]);
            }

        } catch (error) {
            console.error("Error cargando equipos:", error);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error de conexión con el servidor.</td></tr>';
        }
    }

    // ---------------------------------------------------------
    // 6. RENDERIZAR TABLA
    // ---------------------------------------------------------
    function renderizarTabla(listaEquipos) {
        const tbody = document.querySelector('.sena-table tbody');
        tbody.innerHTML = ''; 

        if (listaEquipos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No se encontraron equipos registrados.</td></tr>';
            return;
        }

        listaEquipos.forEach(equipo => {
            const row = document.createElement('tr');
            
            const idEquipo = equipo.idequipo || equipo._id;

            // HTML de la fila
            row.innerHTML = `
                <td>${equipo.modelo || 'Sin Modelo'}</td>
                <td>${equipo.numerodeserie || 'Sin Serial'}</td>
                <td>${equipo.idinvitado || 'No asignado'}</td>
                <td>
                    <span class="badge ${equipo.estado === 'Activo' ? 'status-active' : 'status-inactive'}">
                        ${equipo.estado ==='Activo' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editarEquipo('${idEquipo}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="eliminarEquipo('${idEquipo}')" title="Eliminar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Exportar para uso global
    window.cargarEquiposGlobal = cargarEquipos; 
});


// ---------------------------------------------------------
// FUNCIONES GLOBALES (FUERA DEL DOMCONTENTLOADED)
// ---------------------------------------------------------

// Color global para SweetAlert fuera del evento
const SENA_GREEN_GLOBAL = '#018102';

function editarEquipo(id) {
    // Redirige a la página de edición
    window.location.href = `editdevice.html?id=${id}`;
}

window.eliminarEquipo = async (id) => {
    
    // 1. Confirmación con SweetAlert
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a eliminar este equipo del sistema. Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: SENA_GREEN_GLOBAL,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        
        if (result.isConfirmed) {
            
            const token = localStorage.getItem('token');
            
            // 2. Loading...
            Swal.fire({
                title: 'Eliminando...',
                text: 'Espere un momento',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const response = await fetch(`http://localhost:3333/portero/equipo/eliminar/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    // 3. Éxito
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El equipo ha sido eliminado correctamente.',
                        confirmButtonColor: SENA_GREEN_GLOBAL
                    }).then(() => {
                        // Recargamos la tabla
                        if(window.cargarEquiposGlobal) window.cargarEquiposGlobal(); 
                    });

                } else {
                    // Error Backend
                    const data = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.mensaje || 'No se pudo eliminar el equipo',
                        confirmButtonColor: SENA_GREEN_GLOBAL
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor',
                    confirmButtonColor: SENA_GREEN_GLOBAL
                });
            }
        }
    });
};