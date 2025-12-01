document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DEL SIDEBAR (Igual que en admin) ---
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // --- LÓGICA DE MOSTRAR/OCULTAR CONTRASEÑA ---
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            // Alternar el tipo de atributo
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Alternar el icono (ojo abierto / ojo tachado)
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // --- ENVÍO DEL FORMULARIO ---
    const createForm = document.getElementById('createUserForm');

    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturar datos básicos
            const nombres = document.getElementById('nombres').value;
            const rol = document.getElementById('rol').value;

            // Simulación de creación
            alert(`¡Usuario creado exitosamente!\n\nNombre: ${nombres}\nRol asignado: ${rol.toUpperCase()}`);
            
            // Redirigir al panel principal
            window.location.href = 'admin.html';
        });
    }
});