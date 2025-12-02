document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SEGURIDAD
    const token = localStorage.getItem('token');
    const rolLogueado = localStorage.getItem('rol');

    if (!token || rolLogueado !== 'Administrador') {
        window.location.href = 'index.html';
        return;
    }

    // 2. OBTENER PARAMETROS DE URL
    const params = new URLSearchParams(window.location.search);
    
    // IMPORTANTE: 'id' debe ser el valor que espera tu ruta (idadmin o idportero)
    // Puede ser el ID numérico interno o el documento, depende de cómo esté tu BD,
    // pero debe coincidir con lo que 'buscarporId' espera.
    const idUsuario = params.get('id'); 
    const rolUsuario = params.get('rol'); // 'Administrador' o 'Portero'

    if (!idUsuario || !rolUsuario) {
        alert("Error: No se ha seleccionado un usuario.");
        window.location.href = 'adminpanel.html';
        return;
    }

    // 3. REFERENCIAS AL DOM
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

    // 4. CARGAR DATOS (GET)
    const BASE_URL = "http://localhost:3333";

    try {
        let urlFetch = '';
        
        if (rolUsuario === 'Administrador') {
            // Ruta: /buscar/:idadmin
            urlFetch = `${BASE_URL}/admin/buscar/${idUsuario}`;
        } else {
            // Ruta: /portero/buscar/:idportero
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
            throw new Error("Error de servidor.");
        }

        // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
        // Tus controladores devuelven res.json(objeto), así que 'data' es el usuario.
        const usuario = await respuesta.json(); 

        if (usuario) {
            docInput.value = usuario.documento;
            nombreInput.value = usuario.nombres;
            emailInput.value = usuario.correopersonal;
            telInput.value = usuario.telefono;
            rolSelect.value = rolUsuario; 
        }

    } catch (error) {
        console.error("Error cargando usuario:", error);
        alert(error.message);
        window.location.href = 'adminpanel.html';
    }

    // 5. ENVIAR CAMBIOS (PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Preparar objeto para el controlador de ACTUALIZAR
        // Se usan t1, t2, t3, t4, t5 según tu lógica de backend previa
        const datosBackend = {
            t1: docInput.value,    // Documento
            t2: nombreInput.value, // Nombres
            t3: telInput.value,    // Teléfono
            t4: emailInput.value,  // Correo
            t5: passInput.value    // Contraseña
        };

        try {
            let urlUpdate = '';
            
            if (rolUsuario === 'Administrador') {
                // Ruta: /actualizar/:idadmin
                urlUpdate = `${BASE_URL}/admin/actualizar/${idUsuario}`;
            } else {
                // Ruta: /portero/actualizar/:idportero
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
                alert("Usuario actualizado exitosamente.");
                window.location.href = 'adminpanel.html';
            } else {
                alert(`Error: ${result.mensaje || "No se pudo actualizar"}`);
            }

        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error de conexión con el servidor.");
        }
    });
});