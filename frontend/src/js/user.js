document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. VERIFICACIÓN DE SEGURIDAD
    // =========================================================
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');

    if (!token || !idUsuario || rol !== 'Invitado') {
        alert("No has iniciado sesión o no tienes permisos.");
        window.location.href = 'index.html'; 
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

    // Secciones (Tarjetas)
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
    
    // Botones de Ojo (Ver contraseña)
    const togglePassBtn = document.getElementById('togglePassBtn');
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassBtn');

    // Tabla de Equipos
    const tablaEquiposBody = document.querySelector('.sena-table tbody');

    // =========================================================
    // 2. LÓGICA DE NAVEGACIÓN (TABS)
    // =========================================================

    linkPerfil.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('perfil');
        cargarDatosPerfil();
    });

    linkEquipos.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('equipos');
        cargarEquipos();
    });

    function mostrarSeccion(seccion) {
        if (seccion === 'perfil') {
            sectionPerfil.classList.remove('hidden');
            sectionEquipos.classList.add('hidden');
            linkPerfil.classList.add('active');
            linkEquipos.classList.remove('active');
        } else {
            sectionPerfil.classList.add('hidden');
            sectionEquipos.classList.remove('hidden');
            linkPerfil.classList.remove('active');
            linkEquipos.classList.add('active');
        }
        if (window.innerWidth <= 768) toggleMenu();
    }

    // Inicializar vista
    sectionEquipos.classList.add('hidden');

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
            alert('No se pudo cargar la información del usuario.');
        }
    }

    // =========================================================
    // 4. CONSUMO DE API - CARGAR EQUIPOS (GET)
    // =========================================================
    async function cargarEquipos() {
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
                        <td><span class="badge status-active">Activo</span></td>
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
    // 6. VISIBILIDAD DE CONTRASEÑA (OJITOS)
    // =========================================================
    function toggleVisibility(inputElement, iconElement) {
        const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
        inputElement.setAttribute('type', type);
        iconElement.classList.toggle('fa-eye');
        iconElement.classList.toggle('fa-eye-slash');
    }

    // Evento para campo Contraseña
    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            toggleVisibility(passInput, togglePassBtn);
        });
    }

    // Evento para campo Confirmar
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
                alert("Las contraseñas no coinciden.");
                return;
            }

            // B. Validar que la contraseña no esté vacía (Requerido por Backend)
            if (!passInput.value) {
                alert("Para actualizar datos, debes ingresar una contraseña válida (nueva o la actual) por seguridad.");
                return;
            }

            // C. Preparar objeto para el Backend (t1...t5)
            const datosParaEnviar = {
                t1: documentoInput.value, // Documento
                t2: nombreInput.value,    // Nombres
                t3: telefonoInput.value,  // Teléfono
                t4: correoInput.value,    // Correo
                t5: passInput.value       // Contraseña
            };

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

                alert("¡Datos actualizados correctamente!");
                
                // Limpiar contraseña y recargar
                passInput.value = '';
                confirmPassInput.value = '';
                cargarDatosPerfil();

            } catch (error) {
                console.error("Error update:", error);
                alert(error.message);
            }
        });
    }

    // Carga inicial
    cargarDatosPerfil();
});