document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 0. VERIFICACIÓN DE SEGURIDAD
    // =========================================================
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');

    if (!token || !idUsuario || rol !== 'Invitado') {
        alert("No has iniciado sesión o no tienes permisos.");
        window.location.href = 'index.html'; // O tu página de login
        return;
    }

    // Configuración de la URL base de tu API
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
    const documentoInput = document.getElementById('documento');
    const nombreInput = document.getElementById('nombres');
    const correoInput = document.getElementById('correo');
    const telefonoInput = document.getElementById('telefono');

    // Tabla de Equipos
    const tablaEquiposBody = document.querySelector('.sena-table tbody');

    // =========================================================
    // 2. LÓGICA DE NAVEGACIÓN (TABS)
    // =========================================================
    
    // Función para mostrar Perfil
    linkPerfil.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('perfil');
        cargarDatosPerfil(); // Recargar datos al hacer click
    });

    // Función para mostrar Equipos
    linkEquipos.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('equipos');
        cargarEquipos(); // Cargar equipos al hacer click
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
        // Cerrar menú en móvil si está abierto
        if (window.innerWidth <= 768) toggleMenu();
    }

    // Inicializar vista (ocultar equipos al inicio)
    sectionEquipos.classList.add('hidden');

    // =========================================================
    // 3. CONSUMO DE API - CARGAR PERFIL
    // =========================================================
    async function cargarDatosPerfil() {
        try {
            const response = await fetch(`${API_URL}/invitado/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Enviamos el token
                }
            });

            if (!response.ok) throw new Error('Error al obtener perfil');

            const data = await response.json();
            // Asumiendo que tu backend devuelve { mensaje: "...", invitado: { ... } }
            const user = data.invitado; 

            if (user) {
                // Rellenar inputs
                // Asegúrate que los nombres de las propiedades coincidan con tu base de datos
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
    // 4. CONSUMO DE API - CARGAR EQUIPOS
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
            const listaEquipos = data.equipos; // Según tu controlador devuelve { equipos: [...] }

            // Limpiar tabla actual
            tablaEquiposBody.innerHTML = '';

            if (listaEquipos.length === 0) {
                tablaEquiposBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No tienes equipos registrados.</td></tr>';
                return;
            }

            // Rellenar tabla
            listaEquipos.forEach(eq => {
                // Ajusta las propiedades (eq.marca, eq.serial) según tu base de datos
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

    // Función auxiliar para fechas
    function formatearFecha(fechaString) {
        if (!fechaString) return 'N/A';
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-CO');
    }

    // =========================================================
    // 5. CARGA INICIAL
    // =========================================================
    cargarDatosPerfil(); // Cargar datos apenas abra la página

    // =========================================================
    // 6. MENÚ LATERAL (Tu lógica original)
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
    // 7. LÓGICA DE VALIDACIÓN (Simplificada para no alargar)
    // =========================================================
    // Aquí puedes pegar tus validaciones (Regex, etc) que tenías antes
    // para el formulario de actualización.
});