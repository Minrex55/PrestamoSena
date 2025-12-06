document.addEventListener('DOMContentLoaded', () => {

    // CONSTANTE DE COLOR
    const SENA_GREEN = '#018102';

    const recoveryForm = document.getElementById('recoveryForm');
    const emailInput = document.getElementById('email');
    const btnSendCode = document.getElementById('btnSendCode');
    const codeInput = document.getElementById('code');
    const passwordSection = document.getElementById('passwordSection');
    const codeGroup = document.getElementById('codeGroup'); 

    // URL de tu backend
    const BASE_URL = 'http://localhost:3333/recovery';

    // --- UTILS (Mantenemos estas funciones para validación visual rápida) ---
    function mostrarError(input, mensaje) {
        const group = input.parentElement;
        group.classList.add('error');
        let small = group.querySelector('.error-message');
        if (!small) {
            small = document.createElement('small');
            small.classList.add('error-message');
            // Estilos sugeridos para el mensaje inline
            small.style.color = 'red';
            small.style.fontSize = '0.8rem';
            small.style.marginTop = '5px';
            small.style.display = 'block';
            group.appendChild(small);
        }
        small.innerText = mensaje;
    }

    function limpiarError(input) {
        const group = input.parentElement;
        group.classList.remove('error');
        const small = group.querySelector('.error-message');
        if (small) small.remove();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // =========================================================
    // 1. ENVIAR CÓDIGO (Fetch al Backend)
    // =========================================================
    if(btnSendCode) {
        btnSendCode.addEventListener('click', async () => {
            const emailValue = emailInput.value.trim();
            limpiarError(emailInput);

            // Validaciones locales (usamos texto rojo inline, es menos molesto)
            if (!emailValue) {
                mostrarError(emailInput, "Ingresa tu correo.");
                return;
            }
            if (!isValidEmail(emailValue)) {
                mostrarError(emailInput, "Formato de correo inválido.");
                return;
            }

            // Alerta de Carga
            Swal.fire({
                title: 'Enviando código...',
                text: 'Por favor espera un momento',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const response = await fetch(`${BASE_URL}/enviar-codigo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailValue })
                });
                const data = await response.json();

                if (data.success) {
                    // ÉXITO
                    Swal.fire({
                        icon: 'success',
                        title: '¡Código Enviado!',
                        text: 'Revisa tu bandeja de entrada o spam.',
                        confirmButtonColor: SENA_GREEN,
                        confirmButtonText: 'Entendido'
                    });

                    // Mostrar campo de código
                    if(codeGroup) {
                        codeGroup.classList.remove('hidden');
                        codeGroup.classList.add('fade-in');
                    }
                    
                    codeInput.focus();
                    btnSendCode.innerText = "Reenviar Código";
                
                } else {
                    // ERROR DEL SERVIDOR
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || "No se pudo enviar el código.",
                        confirmButtonColor: SENA_GREEN
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }

    // =========================================================
    // 2. VALIDACIÓN DEL CÓDIGO (Automática al tener 6 dígitos)
    // =========================================================
    if(codeInput) {
        codeInput.addEventListener('input', async (e) => {
            limpiarError(codeInput);
            const current = e.target.value.trim();

            // Solo consultamos al servidor si tiene 6 dígitos
            if (current.length === 6) {
                
                // Pequeña notificación de "Verificando..." (Toast top-end)
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });

                // Bloqueamos el input temporalmente
                codeInput.disabled = true;

                try {
                    const response = await fetch(`${BASE_URL}/verificar-codigo`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            email: emailInput.value.trim(),
                            codigo: current 
                        })
                    });
                    const data = await response.json();

                    codeInput.disabled = false;

                    if (data.success) {
                        // ÉXITO: Toast Verde
                        Toast.fire({
                            icon: 'success',
                            title: 'Código verificado correctamente'
                        });

                        // Mostrar sección de password
                        passwordSection.classList.remove('hidden');
                        void passwordSection.offsetWidth; // Force reflow
                        passwordSection.classList.add('fade-in');

                        // Estilos visuales de éxito en el input
                        codeInput.setAttribute("readonly", true);
                        codeInput.style.borderColor = SENA_GREEN;
                        codeInput.style.backgroundColor = "#e8f5e9"; // Verde muy claro
                        
                        btnSendCode.disabled = true;
                        
                        // Foco al nuevo password
                        document.getElementById('newPassword').focus();

                    } else {
                        // ERROR: Alerta normal
                        Swal.fire({
                            icon: 'error',
                            title: 'Código Incorrecto',
                            text: 'El código ingresado no es válido o ha expirado.',
                            confirmButtonColor: SENA_GREEN
                        });
                        codeInput.value = ""; // Limpiar para intentar de nuevo
                        codeInput.focus();
                    }
                } catch (error) {
                    codeInput.disabled = false;
                    console.error(error);
                }
            }
        });
    }

    // =========================================================
    // 3. CAMBIO DE CONTRASEÑA
    // =========================================================
    if(recoveryForm) {
        recoveryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (passwordSection.classList.contains('hidden')) return;

            const newPass = document.getElementById('newPassword').value.trim();
            const confirmPass = document.getElementById('confirmPassword').value.trim();

            // Validaciones básicas
            if (newPass === "" || confirmPass === "") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor ingresa y confirma tu nueva contraseña.',
                    confirmButtonColor: SENA_GREEN
                });
                return;
            }

            if (newPass !== confirmPass) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Las contraseñas no coinciden.',
                    confirmButtonColor: SENA_GREEN
                });
                return;
            }

            // Alerta de Carga
            Swal.fire({
                title: 'Actualizando contraseña...',
                text: 'Procesando solicitud',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const response = await fetch(`${BASE_URL}/cambiar-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        newPassword: newPass
                    })
                });
                const data = await response.json();

                if (data.success) {
                    // ÉXITO FINAL
                    Swal.fire({
                        icon: 'success',
                        title: '¡Contraseña Actualizada!',
                        text: 'Ahora puedes iniciar sesión con tu nueva clave.',
                        confirmButtonText: 'Ir al Login',
                        confirmButtonColor: SENA_GREEN,
                        allowOutsideClick: false
                    }).then(() => {
                        window.location.href = 'login.html';
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'No se pudo actualizar la contraseña.',
                        confirmButtonColor: SENA_GREEN
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Intenta nuevamente más tarde.',
                    confirmButtonColor: SENA_GREEN
                });
            }
        });
    }
    // =========================================================
    // 4. NUEVA FUNCIONALIDAD: VISIBILIDAD DE CONTRASEÑA
    // =========================================================
    
    // Función reutilizable para alternar visibilidad
    function setupPasswordToggle(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);

        if (input && icon) {
            icon.addEventListener('click', () => {
                // Alternar tipo
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);

                // Alternar icono
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }
    }

    // Activamos para ambos campos
    setupPasswordToggle('newPassword', 'toggleNewPassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');
});