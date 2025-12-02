document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SEGURIDAD
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'Administrador') {
        window.location.href = 'index.html';
        return;
    }

    // 2. SIDEBAR Y MENU
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    if (overlay) overlay.addEventListener('click', () => { if (sidebar.classList.contains('active')) toggleMenu(); });


    // 3. CARGAR USUARIOS
    // Nota: En tu HTML el ID es "btn-porteros", pero sugerimos usarlo para cargar todos.
    const btnCargar = document.getElementById("btn-porteros"); 
    const tablaBody = document.querySelector(".sena-table tbody");

    // Cargar automáticamente al iniciar
    cargarUsuarios();

    if(btnCargar) {
        btnCargar.addEventListener("click", (e) => {
            e.preventDefault();
            cargarUsuarios();
        });
    }

    async function cargarUsuarios() {
        tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center">Cargando datos...</td></tr>';

        try {
            const BASE_URL = "http://localhost:3333";
            
            // Hacemos dos peticiones en paralelo (Admins y Porteros)
            const [resAdmin, resPortero] = await Promise.all([
                fetch(`${BASE_URL}/admin/buscar`, { headers: { 'Authorization': `Bearer ${token}` }}),
                fetch(`${BASE_URL}/admin/portero/buscar`, { headers: { 'Authorization': `Bearer ${token}` }})
            ]);

            let admins = [];
            let porteros = [];

            if (resAdmin.ok) {
                const dataA = await resAdmin.json();
                
                admins = dataA.Administradores || dataA || [];
            }
            
            if (resPortero.ok) {
                const dataP = await resPortero.json();
                
                porteros = dataP["Porteros Existentes"] || dataP || [];
            }

            // Unificamos listas agregando el ROL manualmente para saber quién es quién
            const listaAdmins = admins.map(u => ({ ...u, rol_real: 'Administrador' }));
            const listaPorteros = porteros.map(u => ({ ...u, rol_real: 'Portero' }));
            const todos = [...listaAdmins, ...listaPorteros];

            tablaBody.innerHTML = "";

            if (todos.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center">No hay usuarios registrados.</td></tr>';
                return;
            }

            // --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
            todos.forEach(usuario => {
                const fila = document.createElement("tr");
                
                // Detectamos cuál es el ID real (idadmin o idportero)
                // Esto es crucial para que el backend pueda buscarlo luego
                const idReal = usuario.idadmin || usuario.idportero;

                fila.innerHTML = `
                    <td>${usuario.documento}</td>
                    <td>${usuario.nombres}</td>
                    <td>${usuario.correopersonal}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.rol_real}</td> <!-- Mostramos el rol asignado arriba -->
                    <td>Activo</td>
                    <td>
                        <div class="action-buttons">
                            <!-- EL CAMBIO: Pasamos idReal y el rol a la función -->
                            <button class="btn-edit" onclick="editarUsuario('${idReal}', '${usuario.rol_real}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="eliminarUsuario('${idReal}', '${usuario.rol_real}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });

        } catch (error) {
            console.error(error);
            tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red">Error de conexión.</td></tr>';
        }
    }
});

// ---------------------------------------------------------
// FUNCIONES GLOBALES (FUERA DEL DOMCONTENTLOADED)
// ---------------------------------------------------------

// Esta función recibe el ID (1, 2, 3...) y el Rol ('Administrador')
function editarUsuario(id, rol) {
    // Redirige a la página de edición poniendo los datos en la URL
    window.location.href = `edituser.html?id=${id}&rol=${rol}`;
}

// ---------------------------------------------------------
// FUNCIÓN PARA ELIMINAR USUARIO
// ---------------------------------------------------------
async function eliminarUsuario(id, rol) {
    
    // 1. Confirmación visual antes de borrar
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar a este ${rol}? Esta acción es irreversible.`);
    if (!confirmar) return;

    // 2. Verificar sesión
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Tu sesión ha expirado.");
        window.location.href = 'index.html';
        return;
    }

    // 3. Construir la URL según tus rutas
    const BASE_URL = "http://localhost:3333"; 
    let urlDestino = "";

    if (rol === 'Administrador') {
        urlDestino = `${BASE_URL}/admin/eliminar/${id}`;
    } else {
        urlDestino = `${BASE_URL}/admin/portero/eliminar/${id}`;
    }

    
    try {
        const respuesta = await fetch(urlDestino, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Importante para AuthMiddleware
                'Content-Type': 'application/json'
            }
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            // Éxito (200 OK)
            alert(`${rol} eliminado correctamente.`);
            // Recargamos la página para que desaparezca de la tabla
            window.location.reload();
        } else {
            // Error (404, 500, etc.)
            alert(`Error al eliminar: ${data.mensaje || "Ocurrió un error inesperado."}`);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
}