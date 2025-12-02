document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. SEGURIDAD: Verificar sesión
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'Administrador') {
        alert('Debes iniciar sesión como Administrador.');
        window.location.href = './login.html';
        return;
    }

    // ---------------------------------------------------------
    // 2. LÓGICA DEL MENÚ (SIDEBAR)
    // ---------------------------------------------------------
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if(menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if(overlay) {
        overlay.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) toggleMenu();
        });
    }

    // ---------------------------------------------------------
    // 3. CARGAR PORTEROS (Sin contraseña y con tus botones)
    // ---------------------------------------------------------
    const btnPorteros = document.getElementById("btn-porteros");
    const tablaBody = document.querySelector(".sena-table tbody");

    async function cargarPorteros() {
        tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center">Cargando datos...</td></tr>';

        try {
            // Verifica si tu puerto es 3000 o 3333
            const respuesta = await fetch("http://localhost:3333/admin/portero/buscar", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (respuesta.status === 401 || respuesta.status === 403) {
                alert("Tu sesión ha expirado.");
                localStorage.clear();
                window.location.href = "./index.html";
                return;
            }

            const data = await respuesta.json();
            const porteros = data["Porteros Existentes"] || [];

            tablaBody.innerHTML = ""; 

            if (porteros.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center">No se encontraron porteros.</td></tr>';
                return;
            }

            porteros.forEach(portero => {
                const fila = document.createElement("tr");

                // Generamos la fila SIN la contraseña y con TUS botones originales
                fila.innerHTML = `
                    <td>${portero.documento || 'N/A'}</td>
                    <td>${portero.nombres}</td>
                    <td>${portero.correopersonal}</td>
                    <td>${portero.telefono || 'N/A'}</td>
                    <td>${portero.rol || 'Portero'}</td>
                    <td>${portero.estado || 'Activo'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="editarPortero('${portero._id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="eliminarPortero('${portero._id}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });

        } catch (error) {
            console.error("Error cargando porteros:", error);
            tablaBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red">Error de conexión.</td></tr>';
        }
    }

    if(btnPorteros) {
        btnPorteros.addEventListener("click", (e) => {
            e.preventDefault();
            cargarPorteros();
        });
    }
});

// Funciones globales para los botones
function editarPortero(id) {
    console.log("Editar ID:", id);
    // Aquí tu lógica para editar
}

function eliminarPortero(id) {
    if(confirm("¿Eliminar este usuario?")) {
        console.log("Eliminar ID:", id);
        // Aquí tu lógica para eliminar
    }
}