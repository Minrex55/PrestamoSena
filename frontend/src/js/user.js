document.addEventListener('DOMContentLoaded', () => {

    // CONSTANTE DE COLOR
    const SENA_GREEN = '#018102';

    // =========================================================
    // 0. VERIFICACIÓN DE SEGURIDAD
    // =========================================================
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');

    if (!token || !idUsuario || rol !== 'Invitado') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No has iniciado sesión o no tienes permisos.',
            confirmButtonColor: SENA_GREEN,
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html'; 
        });
        return;
    }

    // Configuración de la URL base
    const API_URL = 'http://localhost:3333';

    // =========================================================
    // 1. CAPTURAR ELEMENTOS DOM
    // =========================================================
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // Referencia al botón de cerrar sesión (NUEVO)
    const btnLogout = document.querySelector('.logout-item');

    // Secciones
    const sectionPerfil = document.getElementById('perfil');
    const sectionEquipos = document.getElementById('equipos');

    // Links del Sidebar
    const linkPerfil = document.querySelector('a[href="#perfil"]');
    const linkEquipos = document.querySelector('a[href="#equipos"]');

    // Inputs del Formulario Perfil
    const updateForm = document.getElementById('updateForm');
    const documentoInput = document.getElementById('documento');
    const nombreInput = document.getElementById('nombres');
    const correoInput = document.getElementById('correo');
    const telefonoInput = document.getElementById('telefono');
    
    // Inputs Contraseña
    const passInput = document.getElementById('password');
    const confirmPassInput = document.getElementById('confirm_password');
    
    // Botones de Ojo
    const togglePassBtn = document.getElementById('togglePassBtn');
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassBtn');

    // Tabla de Equipos
    const tablaEquiposBody = document.querySelector('.sena-table tbody');

    // =========================================================
    // 2. LÓGICA DE NAVEGACIÓN (TABS)
    // =========================================================

    if(linkPerfil) {
        linkPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarSeccion('perfil');
            cargarDatosPerfil();
        });
    }

    if(linkEquipos) {
        linkEquipos.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarSeccion('equipos');
            cargarEquipos();
        });
    }

    function mostrarSeccion(seccion) {
        if (seccion === 'perfil') {
            if(sectionPerfil) sectionPerfil.classList.remove('hidden');
            if(sectionEquipos) sectionEquipos.classList.add('hidden');
            if(linkPerfil) linkPerfil.classList.add('active');
            if(linkEquipos) linkEquipos.classList.remove('active');
        } else {
            if(sectionPerfil) sectionPerfil.classList.add('hidden');
            if(sectionEquipos) sectionEquipos.classList.remove('hidden');
            if(linkPerfil) linkPerfil.classList.remove('active');
            if(linkEquipos) linkEquipos.classList.add('active');
        }
        if (window.innerWidth <= 768) toggleMenu();
    }

    // Inicializar vista (Ocultar equipos al inicio)
    if(sectionEquipos) sectionEquipos.classList.add('hidden');

    // =========================================================
    // 3. CONSUMO DE API - CARGAR PERFIL (GET)
    // =========================================================
    async function cargarDatosPerfil() {
        try {
            const response = await fetch(`${API_URL}/invitado/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión caducada',
                    confirmButtonColor: SENA_GREEN
                }).then(() => window.location.href = 'login.html');
                return;
            }

            if (!response.ok) throw new Error('Error al obtener perfil');

            const data = await response.json();
            const user = data.invitado; 

            if (user) {
                if(documentoInput) documentoInput.value = user.documento || user.id || '';
                if(nombreInput)    nombreInput.value = user.nombre_completo || user.nombres || '';
                if(correoInput)    correoInput.value = user.correopersonal || '';
                if(telefonoInput)  telefonoInput.value = user.telefono || '';
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo cargar tu información de perfil.',
                confirmButtonColor: SENA_GREEN
            });
        }
    }

    // =========================================================
    // 4. CONSUMO DE API - CARGAR EQUIPOS (GET)
    // =========================================================
    async function cargarEquipos() {
        if(!tablaEquiposBody) return;

        // Loader dentro de la tabla
        tablaEquiposBody.innerHTML = '<tr><td colspan="4" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Cargando tus equipos...</td></tr>';

        try {
            const response = await fetch(`${API_URL}/invitado/equipos/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al obtener equipos');

            const data = await response.json();
            const listaEquipos = data.equipos;

            tablaEquiposBody.innerHTML = '';

            if (!listaEquipos || listaEquipos.length === 0) {
                tablaEquiposBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No tienes equipos registrados.</td></tr>';
                return;
            }

            listaEquipos.forEach(eq => {
                const row = `
                    <tr>
                        <td>${eq.modelo || ''}</td>
                        <td><strong>${eq.numerodeserie}</strong></td>
                        <td>${formatearFecha(eq.fecha_ingreso)}</td>
                        <td>
                            <span class="badge ${eq.estado === 'Activo' ? 'status-active' : 'status-inactive'}">
                                ${eq.estado ==='Activo' ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                    </tr>
                `;
                tablaEquiposBody.innerHTML += row;
            });

        } catch (error) {
            console.error(error);
            tablaEquiposBody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Error al cargar equipos.</td></tr>';
        }
    }

    function formatearFecha(fechaString) {
        if (!fechaString) return 'N/A';
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-CO');
    }

    // =========================================================
    // 5. MENÚ LATERAL
    // =========================================================
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
            if (sidebar.classList.contains('active')) toggleMenu();
        });
    }

    // =========================================================
    // 6. VISIBILIDAD DE CONTRASEÑA
    // =========================================================
    function toggleVisibility(inputElement, iconElement) {
        const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
        inputElement.setAttribute('type', type);
        iconElement.classList.toggle('fa-eye');
        iconElement.classList.toggle('fa-eye-slash');
    }

    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            toggleVisibility(passInput, togglePassBtn);
        });
    }

    if (toggleConfirmBtn && confirmPassInput) {
        toggleConfirmBtn.addEventListener('click', () => {
            toggleVisibility(confirmPassInput, toggleConfirmBtn);
        });
    }

    // =========================================================
    // 7. ACTUALIZAR PERFIL (PUT)
    // =========================================================
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // A. Validar coincidencia
            if (passInput.value !== confirmPassInput.value) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error de contraseñas',
                    text: 'Las contraseñas nuevas no coinciden.',
                    confirmButtonColor: SENA_GREEN
                });
                return;
            }

            // B. Validar que la contraseña no esté vacía
            if (!passInput.value) {
                Swal.fire({
                    icon: 'info',
                    title: 'Contraseña requerida',
                    text: 'Por seguridad, debes ingresar tu contraseña (o una nueva) para guardar cambios.',
                    confirmButtonColor: SENA_GREEN
                });
                return;
            }

            // C. Preparar objeto para el Backend
            const datosParaEnviar = {
                t1: documentoInput.value,
                t2: nombreInput.value,
                t3: telefonoInput.value,
                t4: correoInput.value,
                t5: passInput.value
            };

            // D. Loading
            Swal.fire({
                title: 'Actualizando datos...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const response = await fetch(`${API_URL}/invitado/${idUsuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(datosParaEnviar)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.mensaje || "Error al actualizar");
                }

                // ÉXITO
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Tus datos han sido modificados correctamente.',
                    confirmButtonColor: SENA_GREEN
                }).then(() => {
                    passInput.value = '';
                    confirmPassInput.value = '';
                    cargarDatosPerfil();
                });

            } catch (error) {
                console.error("Error update:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'No se pudieron guardar los cambios.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }

    // Lógica extra para scroll suave (si se usa en móviles)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Si son los mismos tabs que arriba, ya se manejan en mostrarSeccion
            // Si son anclas diferentes, ejecutamos el scroll
            if(targetId !== '#perfil' && targetId !== '#equipos') {
                 const targetSection = document.querySelector(targetId);
                 if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 }
            }
            
            // Cerrar menú en móvil
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });

    // =========================================================
    // 8. CERRAR SESIÓN (NUEVO)
    // =========================================================
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); // Evita redirección inmediata
            
            Swal.fire({
                title: 'Cerrando sesión...',
                text: '¡Hasta pronto!',
                timer: 1500, // 1.5 Segundos
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                willClose: () => {
                    localStorage.clear(); // Limpia toda la sesión
                    window.location.href = 'login.html';
                }
            });
        });
    }

    // Carga inicial
    cargarDatosPerfil();
});