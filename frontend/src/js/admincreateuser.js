document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 0. SEGURIDAD: Verificar que hay un administrador logueado
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rolUsuario = localStorage.getItem('rol');

    if (!token || rolUsuario !== 'Administrador') {
        alert('Sesión no válida. Debes ser Administrador.');
        window.location.href = './index.html';
        return;
    }

    // ---------------------------------------------------------
    // 1. LÓGICA DEL SIDEBAR (Igual que en admin)
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 2. LÓGICA DE MOSTRAR/OCULTAR CONTRASEÑA
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 3. ENVÍO DEL FORMULARIO (CONEXIÓN AL BACKEND)
    // ---------------------------------------------------------
    const createForm = document.getElementById('createUserForm');

    if (createForm) {
        // Hacemos la función 'async' para poder usar await
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // A. Capturar datos del HTML
            const documento = document.getElementById('documento').value;
            const nombres = document.getElementById('nombres').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const telefono = document.getElementById('telefono').value;
            const rolSeleccionado = document.getElementById('rol').value; // admin, vigilante, aprendiz

            // B. Preparar el objeto como lo pide TU CONTROLADOR (t1, t2...)
            const datosBackend = {
                t1: documento,
                t2: nombres,
                t3: telefono,
                t4: email,
                t5: password
            };

            // C. Definir la URL según el rol (Puerto 3333 o 3000 según tu server)
            const BASE_URL = 'http://localhost:3333'; 
            let urlDestino = '';

            if (rolSeleccionado === 'admin') {
                urlDestino = `${BASE_URL}/admin/crear`;
            } else if (rolSeleccionado === 'vigilante') {
                urlDestino = `${BASE_URL}/admin/portero/crear`;
            } else {
                alert('Por favor selecciona un rol válido.');
                return;
            }

            // D. Enviar la petición al servidor
            try {
                const response = await fetch(urlDestino, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // ¡IMPORTANTE! Enviamos el token para pasar el AuthMiddleware
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(datosBackend)
                });

                const data = await response.json();

                // E. Manejar la respuesta
                if (response.ok) {
                    // ÉXITO (201 Created)
                    alert(`¡Usuario creado exitosamente!\n\n${data.mensaje}`);
                    
                    // Limpiar el formulario y volver a la lista
                    createForm.reset();
                    // Asegúrate de que este archivo HTML exista, si es adminpanel.html cámbialo aquí
                    window.location.href = './adminpanel.html'; 

                } else {
                    // ERROR (400, 401, 409, 500)
                    
                    // Si el token venció
                    if (response.status === 401 || response.status === 403) {
                        alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
                        window.location.href = 'index.html';
                        return;
                    }

                    // Errores de validación (contraseña débil, usuario ya existe, etc.)
                    alert('No se pudo crear el usuario:\n' + (data.mensaje || data.error));
                }

            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión con el servidor.');
            }
        });
    }
});