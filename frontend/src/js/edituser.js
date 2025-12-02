document.addEventListener('DOMContentLoaded', async () => {
    
    // CONSTANTE DE COLOR INSTITUCIONAL
    const SENA_GREEN = '#018102';

    // ---------------------------------------------------------
    // 1. SEGURIDAD
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rolLogueado = localStorage.getItem('rol');

    if (!token || rolLogueado !== 'Administrador') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'Debes ser Administrador para ver esta página.',
            confirmButtonColor: SENA_GREEN,
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // ---------------------------------------------------------
    // 2. OBTENER PARAMETROS DE URL
    // ---------------------------------------------------------
    const params = new URLSearchParams(window.location.search);
    const idUsuario = params.get('id'); 
    const rolUsuario = params.get('rol'); // 'Administrador' o 'Portero'

    if (!idUsuario || !rolUsuario) {
        Swal.fire({
            icon: 'warning',
            title: 'Error de navegación',
            text: 'No se ha seleccionado un usuario válido para editar.',
            confirmButtonColor: SENA_GREEN
        }).then(() => {
            window.location.href = 'adminpanel.html';
        });
        return;
    }

    // ---------------------------------------------------------
    // 3. REFERENCIAS AL DOM
    // ---------------------------------------------------------
    const docInput = document.getElementById('documento');
    const nombreInput = document.getElementById('nombres');
    const emailInput = document.getElementById('email');
    const telInput = document.getElementById('telefono');
    const rolSelect = document.getElementById('rol');
    const passInput = document.getElementById('password');
    const form = document.getElementById('editUserForm');

    // Toggle Password
    const togglePassBtn = document.getElementById('togglePassword');
    if(togglePassBtn){
        togglePassBtn.addEventListener('click', function() {
            const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Sidebar Logic (Si existe en esta vista)
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if(menuBtn && sidebar && overlay) {
        function toggleMenu() { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); }
        menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
        overlay.addEventListener('click', () => { if (sidebar.classList.contains('active')) toggleMenu(); });
    }

    // ---------------------------------------------------------
    // 4. CARGAR DATOS (GET)
    // ---------------------------------------------------------
    const BASE_URL = "http://localhost:3333";

    try {
        // Pantalla de carga inicial
        Swal.fire({
            title: 'Cargando datos...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        let urlFetch = '';
        
        if (rolUsuario === 'Administrador') {
            urlFetch = `${BASE_URL}/admin/buscar/${idUsuario}`;
        } else {
            urlFetch = `${BASE_URL}/admin/portero/buscar/${idUsuario}`;
        }

        const respuesta = await fetch(urlFetch, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!respuesta.ok) {
            if (respuesta.status === 404) throw new Error("Usuario no encontrado.");
            throw new Error("Error obteniendo datos del servidor.");
        }

        const usuario = await respuesta.json(); 

        // Cerramos el loading porque ya tenemos los datos
        Swal.close();

        if (usuario) {
            docInput.value = usuario.documento || '';
            nombreInput.value = usuario.nombres || '';
            emailInput.value = usuario.correopersonal || '';
            telInput.value = usuario.telefono || '';
            rolSelect.value = rolUsuario; 
            // Opcional: Bloquear cambio de documento si es llave primaria
            // docInput.readOnly = true; 
        }

    } catch (error) {
        console.error("Error cargando usuario:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo cargar la información.',
            confirmButtonColor: SENA_GREEN
        }).then(() => {
            window.location.href = 'adminpanel.html';
        });
    }

    // ---------------------------------------------------------
    // 5. ENVIAR CAMBIOS (PUT)
    // ---------------------------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Preparar objeto para el controlador
            const datosBackend = {
                t1: docInput.value,    // Documento
                t2: nombreInput.value, // Nombres
                t3: telInput.value,    // Teléfono
                t4: emailInput.value,  // Correo
                t5: passInput.value    // Contraseña (si está vacía backend debería ignorarla idealmente)
            };

            // Loader de guardado
            Swal.fire({
                title: 'Actualizando usuario...',
                text: 'Procesando cambios',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                let urlUpdate = '';
                
                if (rolUsuario === 'Administrador') {
                    urlUpdate = `${BASE_URL}/admin/actualizar/${idUsuario}`;
                } else {
                    urlUpdate = `${BASE_URL}/admin/portero/actualizar/${idUsuario}`;
                }

                const response = await fetch(urlUpdate, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(datosBackend)
                });

                const result = await response.json();

                if (response.ok) {
                    // ÉXITO
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualización Exitosa!',
                        text: 'Los datos del usuario han sido modificados.',
                        confirmButtonText: 'Volver a la lista',
                        confirmButtonColor: SENA_GREEN
                    }).then(() => {
                        window.location.href = 'adminpanel.html';
                    });

                } else {
                    // ERROR CONTROLADO
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo actualizar',
                        text: result.mensaje || "Verifique los datos e intente nuevamente.",
                        confirmButtonColor: SENA_GREEN
                    });
                }

            } catch (error) {
                console.error("Error al actualizar:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'El servidor no responde. Intente más tarde.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }
});