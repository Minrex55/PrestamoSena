document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Función para abrir/cerrar menú
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    // Evento click en el botón hamburguesa
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el click se propague
        toggleMenu();
    });

    // Evento click en el overlay (fondo oscuro) para cerrar
    overlay.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Opcional: Cerrar menú si se hace click en un enlace del sidebar (UX móvil)
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // -------------------------------
    //  Cargar porteros en la tabla
    //  Esta bien asi pero no es muy seguro
    // -------------------------------
    const btnPorteros = document.getElementById("btn-porteros");
    const tablaBody = document.querySelector(".sena-table tbody");

    async function cargarPorteros() {
        try {
            const respuesta = await fetch("http://localhost:3333/admin/portero/buscar");
            const data = await respuesta.json();

            const porteros = data["Porteros Existentes"];
            tablaBody.innerHTML = "";

            porteros.forEach(portero => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${portero.documento}</td>
                    <td>${portero.nombres}</td>
                    <td>${portero.correopersonal}</td>
                    <td>${portero.telefono}</td>
                    <td>${portero.rol}</td>
                    <td>${portero.estado}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });

        } catch (error) {
            console.error("Error cargando porteros:", error);
        }
    }

    btnPorteros.addEventListener("click", (e) => {
        e.preventDefault();
        cargarPorteros();
    });

});