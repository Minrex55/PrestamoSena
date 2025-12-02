document.addEventListener('DOMContentLoaded', () => {
    
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
        alert('No tienes permiso para acceder a esta página o tu sesión expiró.');
        window.location.href = 'login.html';
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
        try {
            const response = await fetch(`${BASE_URL}/invitado`, { headers: HEADERS });
            
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
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error cargando datos del servidor.</td></tr>';
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
            
            // Validamos propiedades (Backend puede enviar 'nombre' o 'nombres')
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
                        <button class="btn-delete" data-id="${id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Asignar eventos a los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const idEliminar = this.getAttribute('data-id');
                eliminarInvitado(idEliminar);
            });
        });
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
                // Recargamos del servidor para actualizar la lista global y la tabla
                cargarInvitados();
            } else {
                alert('Hubo un error al intentar eliminar.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión con el servidor.');
        }
    }

    // ---------------------------------------------------------
    // 5. EVENT LISTENERS Y BÚSQUEDA LOCAL
    // ---------------------------------------------------------
    
    // LÓGICA DE BÚSQUEDA INSTANTÁNEA (FILTRO LOCAL)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // 1. Obtenemos el texto y lo ponemos en minúsculas
            const texto = e.target.value.toLowerCase().trim();
            
            // 2. Si está vacío, mostramos todo
            if (texto === "") {
                renderizarTabla(listaInvitadosGlobal);
                return;
            }

            // 3. Filtramos la lista global
            const invitadosFiltrados = listaInvitadosGlobal.filter(invitado => {
                // Obtenemos los valores en minúsculas para comparar
                const doc = String(invitado.documento || "").toLowerCase();
                const nom = (invitado.nombre || invitado.nombres || "").toLowerCase();
                
                // Retorna TRUE si el documento O el nombre contienen el texto escrito
                return doc.includes(texto) || nom.includes(texto);
            });

            // 4. Renderizamos los resultados filtrados
            renderizarTabla(invitadosFiltrados);
        });
    }

    // Cerrar Sesión
    if(btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear(); 
            window.location.href = 'login.html';
        });
    }

    // --- INICIALIZACIÓN ---
    cargarInvitados();
});
