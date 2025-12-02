document.addEventListener('DOMContentLoaded', () => {
    
    // CONSTANTE DE COLOR INSTITUCIONAL
    const SENA_GREEN = '#018102';

    // ---------------------------------------------------------
    // VARIABLE GLOBAL PARA ALMACENAR LOS INVITADOS
    // ---------------------------------------------------------
    let listaInvitadosGlobal = [];

    // ---------------------------------------------------------
    // 1. VERIFICACIÓN DE SEGURIDAD
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'Portero') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No tienes permiso para acceder o tu sesión expiró.',
            confirmButtonColor: SENA_GREEN,
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // ---------------------------------------------------------
    // 2. REFERENCIAS DEL DOM
    // ---------------------------------------------------------
    const tableBody = document.querySelector('.sena-table tbody');
    const searchInput = document.getElementById('searchInput');
    const btnLogout = document.querySelector('.logout-item');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Configuración base de la API
    const BASE_URL = 'http://localhost:3333/portero';
    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // ---------------------------------------------------------
    // 3. FUNCIONALIDAD DEL MENÚ
    // ---------------------------------------------------------
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // ---------------------------------------------------------
    // 4. LÓGICA DE DATOS (CRUD)
    // ---------------------------------------------------------

    // --- CARGAR TODOS LOS INVITADOS DEL SERVIDOR ---
    async function cargarInvitados() {
        // Loader dentro de la tabla
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Cargando lista de invitados...</td></tr>';

        try {
            const response = await fetch(`${BASE_URL}/invitado`, { headers: HEADERS });
            
            // Si el token expiró durante la petición
            if (response.status === 401 || response.status === 403) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión Expirada',
                    confirmButtonColor: SENA_GREEN
                }).then(() => {
                    window.location.href = 'login.html';
                });
                return;
            }

            if (!response.ok) throw new Error('Error al obtener invitados');
            
            const data = await response.json();
            
            // GUARDAMOS EN LA VARIABLE GLOBAL
            if (data.invitadosObtenidos && data.invitadosObtenidos.length > 0) {
                listaInvitadosGlobal = data.invitadosObtenidos;
            } else {
                listaInvitadosGlobal = [];
            }

            // Renderizamos la tabla con todo lo que llegó
            renderizarTabla(listaInvitadosGlobal);

        } catch (error) {
            console.error(error);
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red">Error de conexión con el servidor.</td></tr>';
            
            Swal.fire({
                icon: 'error',
                title: 'Error de Red',
                text: 'No se pudieron cargar los datos.',
                confirmButtonColor: SENA_GREEN
            });
        }
    }

    // --- RENDERIZAR LA TABLA (REUTILIZABLE) ---
    function renderizarTabla(listaInvitados) {
        tableBody.innerHTML = ''; // Limpiar tabla actual

        if (!listaInvitados || listaInvitados.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron resultados.</td></tr>';
            return;
        }

        listaInvitados.forEach(invitado => {
            const tr = document.createElement('tr');
            
            // Validamos propiedades
            const doc = invitado.documento || 'N/A';
            const nom = invitado.nombre || invitado.nombres || 'N/A';
            const tel = invitado.telefono || 'N/A';
            const cor = invitado.correopersonal || 'N/A';
            const est = invitado.estado || 'Desconocido';
            const id = invitado.idinvitado || invitado.id || invitado._id;

            // Renderizado de fila
            tr.innerHTML = `
                <td>${id}</td>
                <td>${doc}</td>
                <td>${nom}</td>
                <td>${tel}</td>
                <td>${cor}</td>
                <td>
                    <span class="status-badge ${est === 'Activo' ? 'status-active' : 'status-inactive'}">
                        ${est}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-delete" data-id="${id}" title="Eliminar Invitado">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Asignar eventos a los botones de eliminar (IMPORTANTE)
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const idEliminar = this.getAttribute('data-id');
                eliminarInvitado(idEliminar);
            });
        });
    }

    // --- FUNCIÓN ELIMINAR CON SWEETALERT ---
    async function eliminarInvitado(id) {
        if (!id) return;

        Swal.fire({
            title: '¿Eliminar Invitado?',
            text: "Esta acción borrará al invitado permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: SENA_GREEN,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                
                // Loader de eliminación
                Swal.fire({
                    title: 'Eliminando...',
                    text: 'Espere un momento',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                try {
                    const response = await fetch(`${BASE_URL}/invitado/eliminar/${id}`, {
                        method: 'DELETE',
                        headers: HEADERS
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El invitado ha sido eliminado correctamente.',
                            confirmButtonColor: SENA_GREEN
                        }).then(() => {
                            // Recargamos del servidor
                            cargarInvitados();
                        });
                    } else {
                        const data = await response.json();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.mensaje || 'Hubo un error al intentar eliminar.',
                            confirmButtonColor: SENA_GREEN
                        });
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo comunicar con el servidor.',
                        confirmButtonColor: SENA_GREEN
                    });
                }
            }
        });
    }

    // ---------------------------------------------------------
    // 5. EVENT LISTENERS Y BÚSQUEDA LOCAL
    // ---------------------------------------------------------
    
    // LÓGICA DE BÚSQUEDA INSTANTÁNEA
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            
            if (texto === "") {
                renderizarTabla(listaInvitadosGlobal);
                return;
            }

            const invitadosFiltrados = listaInvitadosGlobal.filter(invitado => {
                const doc = String(invitado.documento || "").toLowerCase();
                const nom = (invitado.nombre || invitado.nombres || "").toLowerCase();
                return doc.includes(texto) || nom.includes(texto);
            });

            renderizarTabla(invitadosFiltrados);
        });
    }

    // CERRAR SESIÓN CON CONFIRMACIÓN
    if(btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            
            Swal.fire({
                title: 'Cerrando sesión...',
                timer: 1000,
                showConfirmButton: false,
                willClose: () => {
                    localStorage.clear(); 
                    window.location.href = 'login.html';
                }
            });
        });
    }

    // --- INICIALIZACIÓN ---
    cargarInvitados();
});