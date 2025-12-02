document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email.trim() === '' || password.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const datosLogin = {
            t1: email,
            t2: password
        };

        const intentos = [
            {
                rol: 'Administrador',
                url: 'http://localhost:3333/loginadmin/login',
                redirect: './adminpanel.html' 
            },
            {
                rol: 'Portero',
                url: 'http://localhost:3333/loginportero/login',
                redirect: './deviceregister.html'
            },
            {
                rol: 'Invitado',
                url: 'http://localhost:3333/logininvitado/login',
                redirect: './usuario.html'
            }
        ];

        let loginExitoso = false;

        for (const intento of intentos) {
            try {
                const response = await fetch(intento.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosLogin)
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    console.log(`Logueado como ${intento.rol}`);
                    console.log("Datos recibidos:", data); // Para ver qué llega exactamente
                    
                    // 1. Guardamos token y rol
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('rol', intento.rol);
                    
                    // 2. CORRECCIÓN AQUÍ: Guardamos el ID
                    let idGuardado = null;

                    // Tu controlador devuelve { Invitado: { ... } } (Con I mayúscula)
                    if (data.Invitado) {
                        // Busca el id en las propiedades comunes
                        idGuardado = data.Invitado.id || data.Invitado.idinvitado || data.Invitado.documento || data.Invitado._id;
                    } 
                    // Por si acaso el backend cambia o para los otros roles (Admin/Portero)
                    else if (data.invitado) {
                        idGuardado = data.invitado.id;
                    } 
                    else if (data.id) {
                        idGuardado = data.id;
                    }

                    // Si encontramos un ID, lo guardamos
                    if (idGuardado) {
                        localStorage.setItem('idUsuario', idGuardado);
                        console.log("ID Usuario guardado:", idGuardado);
                    } else {
                        console.warn("ATENCIÓN: No se encontró el ID en la respuesta del servidor.");
                    }

                    alert(`Bienvenido ${intento.rol}`);
                    window.location.href = intento.redirect;
                    
                    loginExitoso = true;
                    break; 
                }
            } catch (error) {
                console.warn(`No se pudo conectar con ruta de ${intento.rol}`, error);
            }
        }

        if (!loginExitoso) {
            alert('Correo o contraseña incorrectos, o usuario no registrado.');
        }
    });
});