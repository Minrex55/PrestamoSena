document.addEventListener('DOMContentLoaded', () => {
    
    // CONSTANTE DE COLOR INSTITUCIONAL
    const SENA_GREEN = '#018102';
    
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 1. VALIDACIÓN DE CAMPOS VACÍOS
            if (email.trim() === '' || password.trim() === '') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, ingresa tu correo y contraseña.',
                    confirmButtonColor: SENA_GREEN
                });
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
                    redirect: './portero.html'
                },
                {
                    rol: 'Invitado',
                    url: 'http://localhost:3333/logininvitado/login',
                    redirect: './usuario.html'
                }
            ];

            let loginExitoso = false;

            // 2. MOSTRAR LOADING (Bloquea la pantalla mientras prueba los roles)
            Swal.fire({
                title: 'Iniciando sesión...',
                text: 'Verificando credenciales',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 3. CICLO DE INTENTOS DE LOGIN
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
                        
                        // Guardamos token y rol
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('rol', intento.rol);
                        
                        // Lógica de ID (Conservada de tu código)
                        let idGuardado = null;

                        if (data.Invitado) {
                            idGuardado = data.Invitado.id || data.Invitado.idinvitado || data.Invitado.documento || data.Invitado._id;
                        } 
                        else if (data.invitado) {
                            idGuardado = data.invitado.id;
                        } 
                        else if (data.id) {
                            idGuardado = data.id;
                        }

                        if (idGuardado) {
                            localStorage.setItem('idUsuario', idGuardado);
                        }

                        loginExitoso = true;

                        // 4. LOGIN EXITOSO
                        // Usamos un timer para que sea fluido
                        Swal.fire({
                            icon: 'success',
                            title: `¡Bienvenido ${intento.rol}!`,
                            text: 'Redirigiendo al sistema...',
                            timer: 1500, // Espera 1.5 segundos y se cierra solo
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = intento.redirect;
                        });
                        
                        break; // Salimos del ciclo FOR porque ya entramos
                    }
                } catch (error) {
                    // Si falla la conexión con un rol, intentamos con el siguiente silenciosamente
                    console.warn(`Intento fallido con ${intento.rol}`, error);
                }
            }

            // 5. SI TERMINA EL CICLO Y NO HUBO ÉXITO
            if (!loginExitoso) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: 'Correo o contraseña incorrectos, o usuario no registrado.',
                    confirmButtonText: 'Intentar de nuevo',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }
});