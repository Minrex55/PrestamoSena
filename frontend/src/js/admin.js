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
});