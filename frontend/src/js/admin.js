// Variable global para el color, accesible desde todo el archivo
const SENA_GREEN = '#018102';

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. SEGURIDAD
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'Administrador') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Restringido',
            text: 'Debes iniciar sesión como Administrador.',
            confirmButtonColor: SENA_GREEN,
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // ---------------------------------------------------------
    // 2. SIDEBAR Y MENU
    // ---------------------------------------------------------
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    if (overlay) overlay.addEventListener('click', () => { if (sidebar.classList.contains('active')) toggleMenu(); });


    // ---------------------------------------------------------
    // 3. CARGAR USUARIOS
    // ---------------------------------------------------------
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
        tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Cargando datos...</td></tr>';

        try {
            const BASE_URL = "http://localhost:3333";
            
            // Peticiones en paralelo
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

            // Unificamos listas
            const listaAdmins = admins.map(u => ({ ...u, rol_real: 'Administrador' }));
            const listaPorteros = porteros.map(u => ({ ...u, rol_real: 'Portero' }));
            const todos = [...listaAdmins, ...listaPorteros];

            tablaBody.innerHTML = "";

            if (todos.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center">No hay usuarios registrados.</td></tr>';
                return;
            }

            todos.forEach(usuario => {
                const fila = document.createElement("tr");
                
                // ID real para backend
                const idReal = usuario.idadmin || usuario.idportero;

                fila.innerHTML = `
                    <td>${usuario.documento}</td>
                    <td>${usuario.nombres}</td>
                    <td>${usuario.correopersonal}</td>
                    <td>${usuario.telefono}</td>
                    <td><span class="badge ${usuario.rol_real === 'Administrador' ? 'badge-admin' : 'badge-portero'}">${usuario.rol_real}</span></td>
                    <td>Activo</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="editarUsuario('${idReal}', '${usuario.rol_real}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="eliminarUsuario('${idReal}', '${usuario.rol_real}')" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });

        } catch (error) {
            console.error(error);
            tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red">Error de conexión con el servidor.</td></tr>';
            
            // Opcional: Alerta flotante pequeña (Toast) si falla la carga
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            Toast.fire({
                icon: 'error',
                title: 'Error al cargar usuarios'
            });
        }
    }
});

// ---------------------------------------------------------
// FUNCIONES GLOBALES
// ---------------------------------------------------------

function editarUsuario(id, rol) {
    window.location.href = `edituser.html?id=${id}&rol=${rol}`;
}

// ---------------------------------------------------------
// FUNCIÓN PARA ELIMINAR USUARIO (MODIFICADA CON SWEETALERT)
// ---------------------------------------------------------
function eliminarUsuario(id, rol) {
    
    // 1. Usamos Swal.fire en lugar de confirm()
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar al ${rol}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: SENA_GREEN, // Verde SENA
        cancelButtonColor: '#d33',      // Rojo para cancelar
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        
        // Si el usuario confirma (hace clic en "Sí, eliminar")
        if (result.isConfirmed) {
            
            // Verificamos token nuevamente
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión expirada',
                    text: 'Por favor inicia sesión de nuevo',
                    confirmButtonColor: SENA_GREEN
                }).then(() => window.location.href = 'login.html');
                return;
            }

            const BASE_URL = "http://localhost:3333"; 
            let urlDestino = "";

            if (rol === 'Administrador') {
                urlDestino = `${BASE_URL}/admin/eliminar/${id}`;
            } else {
                urlDestino = `${BASE_URL}/admin/portero/eliminar/${id}`;
            }

            // Mostramos "Cargando..." mientras borra
            Swal.fire({
                title: 'Eliminando...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const respuesta = await fetch(urlDestino, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await respuesta.json();

                if (respuesta.ok) {
                    // ÉXITO
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: `El ${rol} ha sido eliminado correctamente.`,
                        confirmButtonColor: SENA_GREEN
                    }).then(() => {
                        // Recargamos la página para actualizar la tabla
                        window.location.reload();
                    });

                } else {
                    // ERROR DE API
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.mensaje || "No se pudo eliminar el usuario.",
                        confirmButtonColor: SENA_GREEN
                    });
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Verifique su conexión a internet o que el servidor esté activo.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        }
    });
}