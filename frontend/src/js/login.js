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

        // Lista de intentos de login en orden de prioridad
        // Asegúrate de crear los archivos .html de redirección o ajustar las rutas
        const intentos = [
            {
                rol: 'Administrador',
                url: 'http://localhost:3333/loginadmin/login',
                redirect: './adminpanel.html' 
            },
            {
                rol: 'Portero',
                url: 'http://localhost:3333/loginportero/login',
                redirect: './deviceregister.html' // Crea este archivo o cambia la ruta
            },
            {
                rol: 'Invitado',
                url: 'http://localhost:3333/logininvitado/login',
                redirect: './index.html'
            }
        ];

        let loginExitoso = false;

        // Recorremos las rutas una por una
        for (const intento of intentos) {
            try {
                const response = await fetch(intento.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosLogin)
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // LOGIN EXITOSO
                    console.log(`Logueado como ${intento.rol}`);
                    
                    // Guardamos el token y datos
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('rol', intento.rol);
                    
                    // Si el backend devuelve el objeto del usuario (Ej: data.Portero, data.Administrador)
                    // Podrías guardarlo también si lo necesitas.

                    alert(`Bienvenido ${intento.rol}`);
                    window.location.href = intento.redirect;
                    
                    loginExitoso = true;
                    break; // Rompemos el ciclo porque ya encontramos al usuario
                }
            } catch (error) {
                // Si hay error de conexión, seguimos intentando o lo mostramos en consola
                console.warn(`No se pudo conectar con ruta de ${intento.rol}`, error);
            }
        }

        if (!loginExitoso) {
            alert('Correo o contraseña incorrectos, o usuario no registrado.');
        }
    });
});