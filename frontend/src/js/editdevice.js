document.addEventListener('DOMContentLoaded', async () => {
    
    // CONSTANTE DE COLOR
    const SENA_GREEN = '#018102';

    // ---------------------------------------------------------
    // 1. SEGURIDAD: Verificar que sea Portero
    // ---------------------------------------------------------
    const token = localStorage.getItem('token');
    const rolLogueado = localStorage.getItem('rol');

    if (!token || rolLogueado !== 'Portero') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'Debes iniciar sesión como Portero.',
            confirmButtonColor: SENA_GREEN,
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // ---------------------------------------------------------
    // 2. OBTENER PARAMETROS DE URL (ID DEL EQUIPO)
    // ---------------------------------------------------------
    const params = new URLSearchParams(window.location.search);
    const idEquipo = params.get('id'); 

    if (!idEquipo) {
        Swal.fire({
            icon: 'warning',
            title: 'Error de navegación',
            text: 'No se ha seleccionado un equipo para editar.',
            confirmButtonColor: SENA_GREEN
        }).then(() => {
            window.location.href = 'portero.html';
        });
        return;
    }

    // ---------------------------------------------------------
    // 3. REFERENCIAS AL DOM
    // ---------------------------------------------------------
    const modeloInput = document.getElementById('modelo');
    const serialInput = document.getElementById('serial');
    const idInvitadoInput = document.getElementById('idinvitado');
    const estadoSelect = document.getElementById('estado');
    const form = document.getElementById('editEquipoForm');

    // Sidebar Toggle
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // ---------------------------------------------------------
    // 4. CARGAR DATOS DEL EQUIPO (GET)
    // ---------------------------------------------------------
    const BASE_URL = "http://localhost:3333"; 

    try {
        // Mostramos un pequeño loading inicial mientras carga el formulario
        Swal.fire({
            title: 'Cargando información...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const urlFetch = `${BASE_URL}/portero/equipo/buscar/${idEquipo}`;

        const respuesta = await fetch(urlFetch, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!respuesta.ok) {
            if (respuesta.status === 404) throw new Error("Equipo no encontrado.");
            throw new Error("Error obteniendo datos del equipo.");
        }

        const respuestaJson = await respuesta.json(); 
        const equipo = respuestaJson.equipoObtenidoPorId;

        // Cerramos el loading cuando ya tenemos los datos
        Swal.close();

        console.log("Datos del equipo:", equipo);

        if (equipo) {
            modeloInput.value = equipo.modelo || '';
            serialInput.value = equipo.numerodeserie || ''; 
            idInvitadoInput.value = equipo.idinvitado || '';
            estadoSelect.value = equipo.estado || ''; 
        }

    } catch (error) {
        console.error("Error cargando equipo:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo cargar la información.',
            confirmButtonColor: SENA_GREEN
        }).then(() => {
            // Si falla la carga, devolvemos al usuario a la lista
            window.location.href = 'portero.html';
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
                t1: modeloInput.value,
                t2: serialInput.value,
                t3: idInvitadoInput.value,
                t4: estadoSelect.value
            };

            // URL Update
            const urlUpdate = `${BASE_URL}/portero/equipo/actualizar/${idEquipo}`;

            // Alerta de carga (Bloquea la pantalla para evitar doble click)
            Swal.fire({
                title: 'Actualizando equipo...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
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
                        text: 'La información del equipo ha sido actualizada.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: SENA_GREEN
                    }).then(() => {
                        window.location.href = 'portero.html';
                    });

                } else {
                    // ERROR DE API
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar',
                        text: result.mensaje || "No se pudo actualizar el equipo.",
                        confirmButtonColor: SENA_GREEN
                    });
                }

            } catch (error) {
                console.error("Error al actualizar:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }
});