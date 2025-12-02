document.addEventListener('DOMContentLoaded', () => {
    
    // CONSTANTE DE COLOR
    const SENA_GREEN = '#018102';

    // -------------------------------------------------------------------------
    // 1. CONFIGURACIÓN Y REFERENCIAS
    // -------------------------------------------------------------------------
    const BASE_URL = 'http://localhost:3333/portero';
    const token = localStorage.getItem('token');
    
    // Referencias del DOM
    const form = document.getElementById('createUserForm'); // Ojo: Asegúrate que el ID del form en tu HTML sea este, o cámbialo a 'createDeviceForm' si aplica
    const inputModelo = document.getElementById('modelo');
    const inputSerie = document.getElementById('serie');
    const inputInvitado = document.getElementById('invitado');
    const estadoSelect = document.getElementById('estado');

    // Verificar autenticación
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No hay sesión activa. Debes iniciar sesión.',
            confirmButtonColor: SENA_GREEN,
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // -------------------------------------------------------------------------
    // 2. LÓGICA PARA CREAR (REGISTRAR)
    // -------------------------------------------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            // Obtener valores limpios
            const modelo = inputModelo.value.trim();
            const serie = inputSerie.value.trim();
            const invitado = inputInvitado.value.trim();
            const estado = estadoSelect ? estadoSelect.value : 'Activo'; 

            // Validación simple
            if (!modelo || !serie || !invitado) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor, completa todos los campos obligatorios (*).',
                    confirmButtonColor: SENA_GREEN
                });
                return;
            }

            // Preparar objeto para el backend
            const datos = {
                t1: modelo,      // Modelo
                t2: serie,       // Número de serie
                t3: invitado,    // ID Invitado
                t4: estado       // Estado
            };

            // Mostrar Loading
            Swal.fire({
                title: 'Registrando equipo...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(`${BASE_URL}/equipo/crear`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(datos)
                });

                const data = await response.json();

                if (response.ok) {
                    // ÉXITO
                    Swal.fire({
                        icon: 'success',
                        title: '¡Registro Exitoso!',
                        text: 'El equipo ha sido registrado correctamente.',
                        confirmButtonText: 'Registrar otro',
                        confirmButtonColor: SENA_GREEN
                    }).then(() => {
                        form.reset(); // Limpia los inputs
                        // Opcional: Si tienes una vista previa de imagen, límpiala aquí también
                        const preview = document.getElementById('previewContainer');
                        if (preview) preview.innerHTML = '';
                    });

                } else {
                    // ERROR CONTROLADO (Backend dice que falló)
                    
                    // Si el token venció
                    if (response.status === 401 || response.status === 403) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sesión Caducada',
                            text: 'Tu sesión ha expirado. Inicia sesión de nuevo.',
                            confirmButtonColor: SENA_GREEN
                        }).then(() => {
                            window.location.href = 'login.html';
                        });
                        return;
                    }

                    // Otros errores (Ej: Serial duplicado)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: data.mensaje || 'No se pudo crear el registro.',
                        confirmButtonColor: SENA_GREEN
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }
});