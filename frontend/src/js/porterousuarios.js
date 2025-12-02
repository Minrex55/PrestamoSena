document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. VERIFICACIÓN DE SEGURIDAD
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'Portero') {
        alert('No tienes permiso para acceder a esta página o tu sesión expiró.');
        window.location.href = 'index.html';
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
    // 3. FUNCIONALIDAD DEL MENÚ (Responsive)
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

    // --- CARGAR TODOS LOS INVITADOS AL INICIO ---
    async function cargarInvitados() {
        try {
            const response = await fetch(`${BASE_URL}/invitado`, { headers: HEADERS });
            
            if (!response.ok) throw new Error('Error al obtener invitados');
            
            const data = await response.json();
            // El backend devuelve: { mensaje: '...', invitadosObtenidos: [...] }
            renderizarTabla(data.invitadosObtenidos || []);
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error cargando datos del servidor.</td></tr>';
        }
    }

    // --- RENDERIZAR LA TABLA EN EL HTML ---
    function renderizarTabla(listaInvitados) {
        tableBody.innerHTML = ''; // Limpiar tabla actual

        if (!listaInvitados || listaInvitados.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron invitados.</td></tr>';
            return;
        }

        // Convertir a array si viene un solo objeto (búsqueda por documento suele devolver uno solo)
        const invitados = Array.isArray(listaInvitados) ? listaInvitados : [listaInvitados];

        invitados.forEach(invitado => {
            const tr = document.createElement('tr');
            
            // Validamos que existan las propiedades, si no ponemos 'N/A'
            const doc = invitado.documento || 'N/A';
            const nom = invitado.nombre || invitado.nombres || 'N/A';
            const tel = invitado.telefono || 'N/A';
            const cor = invitado.correopersonal || 'N/A';
            const est = invitado.estado || 'Desconocido';
            const id = invitado.idinvitado || invitado.id || invitado._id;

            // Renderizado de fila
            tr.innerHTML = `
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
                        <button class="btn-edit" onclick="alert('Funcionalidad de editar pendiente')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" data-id="${id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Asignar eventos a los botones de eliminar generados
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const idEliminar = this.getAttribute('data-id');
                eliminarInvitado(idEliminar);
            });
        });
    }

    // --- FUNCIÓN DE BÚSQUEDA CORREGIDA ---
    async function realizarBusqueda(termino) {
        // Si el buscador está vacío, cargamos todos
        if (termino.trim() === '') {
            cargarInvitados();
            return;
        }

        try {
            let url = '';
            
            // CORRECCIÓN: Usamos !isNaN para detectar si es número (Documento) o texto (Nombre)
            // Esto verifica si el término NO es "No es un Número" (es decir, sí es un número)
            if (!isNaN(termino) && termino.trim() !== '') {
                // Es un número -> Busca por Documento
                console.log("Buscando por Documento:", termino);
                url = `${BASE_URL}/invitado/documento?documento=${termino}`;
            } else {
                // Es texto -> Busca por Nombre
                console.log("Buscando por Nombre:", termino);
                url = `${BASE_URL}/invitado/nombre?nombres=${termino}`;
            }

            const response = await fetch(url, { headers: HEADERS });
            
            if (response.status === 404) {
                renderizarTabla([]); // Mostrar tabla vacía si no encuentra nada
                return;
            }

            const data = await response.json();
            console.log("Datos recibidos búsqueda:", data);

            // Mapeo dinámico según lo que responda el backend
            let resultados = [];
            
            if (data.invitadoObtenidoPorDocumento) {
                resultados = data.invitadoObtenidoPorDocumento;
            } else if (data.invitadoObtenidoPorNombre) {
                resultados = data.invitadoObtenidoPorNombre;
            } else if (data.invitadosObtenidos) {
                resultados = data.invitadosObtenidos;
            }

            renderizarTabla(resultados);

        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    }

    // --- FUNCIÓN ELIMINAR ---
    async function eliminarInvitado(id) {
        if (!id) return alert("Error: No se identificó el ID del usuario.");
        if (!confirm('¿Estás seguro de eliminar este invitado?')) return;

        try {
            const response = await fetch(`${BASE_URL}/invitado/eliminar/${id}`, {
                method: 'DELETE',
                headers: HEADERS
            });

            if (response.ok) {
                alert('Invitado eliminado correctamente.');
                // Verificamos si hay algo escrito en el buscador para recargar esa búsqueda o todo
                if (searchInput.value.trim() !== '') {
                    realizarBusqueda(searchInput.value);
                } else {
                    cargarInvitados();
                }
            } else {
                alert('Hubo un error al intentar eliminar.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión con el servidor.');
        }
    }

    // ---------------------------------------------------------
    // 5. EVENT LISTENERS
    // ---------------------------------------------------------
    
    // Listener del Buscador con "Debounce" (espera a que termines de escribir)
    let timeoutBusqueda;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutBusqueda);
        const valor = e.target.value;
        
        timeoutBusqueda = setTimeout(() => {
            realizarBusqueda(valor);
        }, 300); // 300ms de espera
    });

    // Cerrar Sesión
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear(); // Limpia token y datos
        window.location.href = 'index.html';
    });

    // Carga inicial
    cargarInvitados();
});