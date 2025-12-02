document.addEventListener('DOMContentLoaded', () => {
    
    // CONSTANTE DE COLOR
    const SENA_GREEN = '#018102';

    const registerForm = document.getElementById('registerForm');

    // Referencias a los campos HTML
    const nombreInput = document.getElementById('nombre');
    const documentoInput = document.getElementById('documento');
    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Toggle para ver contraseña (si existe el icono en tu HTML)
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar recarga de página
            
            let valid = true;

            // --- VALIDACIONES VISUALES (FRONTEND) ---
            // Mantenemos esto igual porque el feedback visual inmediato es excelente

            // 1. Validar Nombre
            const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
            if (!nombreRegex.test(nombreInput.value.trim())) {
                mostrarError(nombreInput, 'El nombre debe tener al menos 3 letras.');
                valid = false;
            } else {
                limpiarError(nombreInput);
            }

            // 2. Validar Documento
            const documentoValor = documentoInput.value.trim();
            if (documentoValor.length < 8 || documentoValor.length > 10 || isNaN(documentoValor)) {
                mostrarError(documentoInput, 'Debe contener entre 8 y 10 números');
                valid = false;
            } else {
                limpiarError(documentoInput);
            }

            // 3. Validar Teléfono (Estricto 10 dígitos)
            const telefonoValor = telefonoInput.value.trim();
            if (!/^\d{10}$/.test(telefonoValor)) {
                mostrarError(telefonoInput, 'El teléfono debe tener exactamente 10 números.');
                valid = false;
            } else {
                limpiarError(telefonoInput);
            }

            // 4. Validar Correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                mostrarError(emailInput, 'Ingresa un correo electrónico válido.');
                valid = false;
            } else {
                limpiarError(emailInput);
            }

            // 5. Validar Contraseña
            const passValor = passwordInput.value;
            const tieneMayus = /[A-Z]/.test(passValor);
            const tieneNum = /[0-9]/.test(passValor);
            const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passValor); 
            const longMin = passValor.length >= 8;

            if (!(tieneMayus && tieneNum && tieneEspecial && longMin)) {
                mostrarError(passwordInput, 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
                valid = false;
            } else {
                limpiarError(passwordInput);
            }

            // Si hay errores visuales, detenemos aquí y avisamos suavemente
            if (!valid) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Formulario incorrecto',
                    text: 'Por favor corrige los campos marcados en rojo.',
                    confirmButtonColor: SENA_GREEN,
                    timer: 2000
                });
                return;
            }

            // --- ENVÍO DE DATOS AL SERVIDOR ---
            if (valid) {
                
                // Mapeo de datos (t1...t5)
                const datosParaEnviar = {
                    t1: documentoInput.value.trim(), // Documento
                    t2: nombreInput.value.trim(),    // Nombres
                    t3: telefonoInput.value.trim(),  // Teléfono
                    t4: emailInput.value.trim(),     // Correo
                    t5: passwordInput.value          // Contraseña
                };

                // Alerta de carga
                Swal.fire({
                    title: 'Registrando usuario...',
                    text: 'Estamos procesando tus datos',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    const url = 'http://localhost:3333/invitado/crear';

                    const respuesta = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(datosParaEnviar)
                    });

                    const data = await respuesta.json();

                    if (respuesta.ok) {
                        // ÉXITO
                        Swal.fire({
                            icon: 'success',
                            title: '¡Registro Exitoso!',
                            text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                            confirmButtonText: 'Ir al Login',
                            confirmButtonColor: SENA_GREEN,
                            allowOutsideClick: false
                        }).then(() => {
                            registerForm.reset();
                            window.location.href = './login.html';
                        });

                    } else {
                        // ERROR DEL SERVIDOR (Ej: Correo duplicado)
                        Swal.fire({
                            icon: 'error',
                            title: 'No se pudo registrar',
                            text: data.mensaje || 'Verifica los datos e intenta nuevamente.',
                            confirmButtonColor: SENA_GREEN
                        });
                    }

                } catch (error) {
                    console.error('Error de red:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor. Verifica que esté encendido.',
                        confirmButtonColor: SENA_GREEN
                    });
                }
            }
        });
    }

    // Funciones visuales (Se mantienen igual)
    function mostrarError(input, mensaje) {
        const formControl = input.parentElement; // Asegúrate que el input esté dentro de un div contenedor
        // Busca si ya hay un small, si no, lo crea (opcional, depende de tu HTML)
        let small = formControl.querySelector('.error-message');
        if(!small) return; // Si no existe el small en el HTML, no hace nada para evitar errores
        
        small.innerText = mensaje;
        formControl.className = 'input-group error'; // Clase CSS para poner rojo el borde
    }

    function limpiarError(input) {
        const formControl = input.parentElement;
        formControl.className = 'input-group'; // Quita la clase error
    }
});