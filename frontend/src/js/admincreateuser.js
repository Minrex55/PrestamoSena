document.addEventListener('DOMContentLoaded', () => {
    
    // VARIABLE DE COLOR PARA FÁCIL MANTENIMIENTO
    const SENA_GREEN = '#018102'; 

    // ---------------------------------------------------------
    // 0. SEGURIDAD
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rolUsuario = localStorage.getItem('rol');

    if (!token || rolUsuario !== 'Administrador') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'Sesión no válida o no tienes permisos.',
            confirmButtonText: 'Ir al Login',
            confirmButtonColor: SENA_GREEN, // <--- COLOR APLICADO
            allowOutsideClick: false
        }).then(() => {
            window.location.href = './login.html';
        });
        return;
    }

    // ... (El código del Sidebar y Contraseña sigue igual) ...
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

    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // ---------------------------------------------------------
    // 3. ENVÍO DEL FORMULARIO
    // ---------------------------------------------------------
    const createForm = document.getElementById('createUserForm');

    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const documento = document.getElementById('documento').value;
            const nombres = document.getElementById('nombres').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const telefono = document.getElementById('telefono').value;
            const rolSeleccionado = document.getElementById('rol').value;

            const datosBackend = {
                t1: documento,
                t2: nombres,
                t3: telefono,
                t4: email,
                t5: password
            };

            const BASE_URL = 'http://localhost:3333'; 
            let urlDestino = '';

            if (rolSeleccionado === 'admin') {
                urlDestino = `${BASE_URL}/admin/crear`;
            } else if (rolSeleccionado === 'vigilante') {
                urlDestino = `${BASE_URL}/admin/portero/crear`;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Faltan datos',
                    text: 'Por favor selecciona un rol válido.',
                    confirmButtonColor: SENA_GREEN // <--- COLOR APLICADO
                });
                return;
            }

            // Alerta de carga
            Swal.fire({
                title: 'Creando usuario...',
                text: 'Por favor espere un momento',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(urlDestino, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(datosBackend)
                });

                const data = await response.json();

                if (response.ok) {
                    // EXITO
                    Swal.fire({
                        icon: 'success',
                        title: '¡Usuario Creado!',
                        text: data.mensaje || 'Registro exitoso.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: SENA_GREEN // <--- COLOR APLICADO
                    }).then(() => {
                        createForm.reset();
                        window.location.href = './adminpanel.html'; 
                    });

                } else {
                    // ERRORES
                    if (response.status === 401 || response.status === 403) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sesión Caducada',
                            text: 'Tu sesión ha expirado.',
                            confirmButtonColor: SENA_GREEN // <--- COLOR APLICADO
                        }).then(() => {
                            window.location.href = 'login.html';
                        });
                        return;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Error al crear',
                        text: data.mensaje || 'Ocurrió un error inesperado',
                        confirmButtonColor: SENA_GREEN // <--- COLOR APLICADO
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonColor: SENA_GREEN // <--- COLOR APLICADO
                });
            }
        });
    }
});