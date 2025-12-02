document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. CONFIGURACIÓN Y REFERENCIAS
    // -------------------------------------------------------------------------
    const BASE_URL = 'http://localhost:3333/portero';
    const token = localStorage.getItem('token');
    
    // Referencias del DOM
    const form = document.getElementById('createUserForm');
    const inputModelo = document.getElementById('modelo');
    const inputSerie = document.getElementById('serie');
    const inputInvitado = document.getElementById('invitado');
    const estadoSelect = document.getElementById('estado');

    // Verificar autenticación
    if (!token) {
        alert('No hay sesión activa. Redirigiendo al inicio...');
        window.location.href = 'login.html';
        return;
    }

    // -------------------------------------------------------------------------
    // 2. LÓGICA PARA CREAR (REGISTRAR)
    // -------------------------------------------------------------------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Obtener valores limpios
        const modelo = inputModelo.value.trim();
        const serie = inputSerie.value.trim();
        const invitado = inputInvitado.value.trim();
        const estado = document.getElementById('estado').value; // Aunque el backend no lo pide explícitamente en el JSON body según tu controlador, lo tomo por si acaso.

        // Validación simple
        if (!modelo || !serie || !invitado) {
            alert('Por favor, completa todos los campos obligatorios (*).');
            return;
        }

        // Preparar objeto para el backend (t1, t2, t3)
        const datos = {
            t1: modelo,      // Modelo
            t2: serie,       // Número de serie
            t3: invitado,     // ID Invitado
            t4: estadoSelect.value  // Estado
        };

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
                alert('¡Equipo registrado exitosamente!');
                form.reset(); // Limpia los inputs para registrar otro
            } else {
                // Muestra mensaje de error del servidor (ej: "Equipo ya existe")
                alert(data.mensaje || 'Error al registrar el equipo.');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor.');
        }
    });
});