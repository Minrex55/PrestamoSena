document.addEventListener('DOMContentLoaded', () => {

    const recoveryForm = document.getElementById('recoveryForm');
    const emailInput = document.getElementById('email');
    const btnSendCode = document.getElementById('btnSendCode');
    const codeInput = document.getElementById('code');
    const passwordSection = document.getElementById('passwordSection');
    
    // NUEVO: Seleccionamos el contenedor del código para mostrarlo/ocultarlo
    const codeGroup = document.getElementById('codeGroup'); 

    // URL de tu backend (Asegúrate de que el puerto sea el correcto)
    const BASE_URL = 'http://localhost:3333/recovery';

    // --- UTILS ---
    function mostrarError(input, mensaje) {
        const group = input.parentElement;
        group.classList.add('error');
        let small = group.querySelector('.error-message');
        if (!small) {
            small = document.createElement('small');
            small.classList.add('error-message');
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

    // 1. ENVIAR CÓDIGO (Fetch al Backend)
    btnSendCode.addEventListener('click', async () => {
        const emailValue = emailInput.value.trim();
        limpiarError(emailInput);

        if (!emailValue) {
            mostrarError(emailInput, "Ingresa tu correo.");
            return;
        }
        if (!isValidEmail(emailValue)) {
            mostrarError(emailInput, "Formato de correo inválido.");
            return;
        }

        // UX: Deshabilitar botón
        btnSendCode.innerText = "Enviando...";
        btnSendCode.disabled = true;

        try {
            const response = await fetch(`${BASE_URL}/enviar-codigo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue })
            });
            const data = await response.json();

            if (data.success) {
                alert("¡Código enviado! Revisa tu correo.");
                
                // --- CAMBIO CLAVE: MOSTRAR EL CAMPO DE CÓDIGO ---
                if(codeGroup) {
                    codeGroup.classList.remove('hidden');
                    codeGroup.classList.add('fade-in');
                }
                
                codeInput.focus();
                btnSendCode.innerText = "Reenviar";
                btnSendCode.disabled = false;
            } else {
                mostrarError(emailInput, data.message || "Error al enviar");
                btnSendCode.innerText = "Enviar";
                btnSendCode.disabled = false;
            }
        } catch (error) {
            console.error(error);
            mostrarError(emailInput, "Error de conexión con el servidor");
            btnSendCode.innerText = "Enviar";
            btnSendCode.disabled = false;
        }
    });

    // 2. VALIDACIÓN DEL CÓDIGO (Fetch al Backend)
    codeInput.addEventListener('input', async (e) => {
        limpiarError(codeInput);
        const current = e.target.value.trim();

        // Solo consultamos al servidor si tiene 6 dígitos
        if (current.length === 6) {
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

                if (data.success) {
                    // ÉXITO
                    passwordSection.classList.remove('hidden');
                    void passwordSection.offsetWidth; // Forzar reflow para animación
                    passwordSection.classList.add('fade-in');

                    codeInput.setAttribute("readonly", true);
                    codeInput.style.borderColor = "#39a900"; // Verde
                    btnSendCode.disabled = true;
                } else {
                    mostrarError(codeInput, "El código es incorrecto.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    });

    // 3. CAMBIO DE CONTRASEÑA (Fetch al Backend)
    recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (passwordSection.classList.contains('hidden')) return;

        const newPass = document.getElementById('newPassword').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value.trim();

        // Validaciones básicas de coincidencia
        if (newPass !== confirmPass) {
            alert('Las contraseñas no coinciden.');
            return;
        }

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
                alert('¡Contraseña actualizada correctamente!');
                window.location.href = 'login.html';
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    });

});