document.addEventListener('DOMContentLoaded', () => {

    const recoveryForm = document.getElementById('recoveryForm');
    const emailInput = document.getElementById('email');
    const btnSendCode = document.getElementById('btnSendCode');
    const codeInput = document.getElementById('code');
    const passwordSection = document.getElementById('passwordSection');

    const CORRECT_CODE = "123456";

    // --- SISTEMA DE VALIDACIONES (IGUAL AL FORMULARIO ANTERIOR) ---
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --------------------------------------------------------------

    // 1. BOTÓN "ENVIAR" – VALIDAR EMAIL
    btnSendCode.addEventListener('click', () => {
        const emailValue = emailInput.value.trim();

        limpiarError(emailInput);

        if (emailValue === '') {
            mostrarError(emailInput, "Por favor ingresa tu correo.");
            return;
        }

        if (!isValidEmail(emailValue)) {
            mostrarError(emailInput, "El correo debe tener el siguiente formato: ejemplo@gmail.com");
            return;
        }

        // Aquí normalmente llamarías al backend para enviar el código
        codeInput.focus();
    });

    // 2. VALIDACIÓN DEL CÓDIGO EN TIEMPO REAL
    codeInput.addEventListener('input', (e) => {
        limpiarError(codeInput);

        const current = e.target.value.trim();

        if (current.length === 6 && current !== CORRECT_CODE) {
            mostrarError(codeInput, "El código es incorrecto.");
            return;
        }

        if (current === CORRECT_CODE) {
            passwordSection.classList.remove('hidden');
            codeInput.setAttribute("readonly", true);
            btnSendCode.disabled = true;
        }
    });

    // 3. Envío final del formulario (Cambio de contraseña)
recoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (passwordSection.classList.contains('hidden')) {
        alert('Debes ingresar el código de verificación correcto primero.');
        return;
    }

    const newPass = document.getElementById('newPassword').value.trim();
    const confirmPass = document.getElementById('confirmPassword').value.trim();

    // Validaciones básicas
    if (newPass === '' || confirmPass === '') {
        alert('Por favor completa los campos de contraseña.');
        return;
    }

    if (newPass !== confirmPass) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // --- VALIDACIONES NUEVAS ---
    const minLength = newPass.length >= 6;
    const hasUpper = /[A-Z]/.test(newPass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-=+]/.test(newPass);

    if (!minLength) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    if (!hasUpper) {
        alert('La contraseña debe incluir al menos una letra mayúscula.');
        return;
    }

    if (!hasSymbol) {
        alert('La contraseña debe incluir al menos un símbolo.');
        return;
    }

    // Simulación de éxito
    console.log("Contraseña actualizada para:", emailInput.value);
    alert('¡Contraseña actualizada correctamente!');
    window.location.href = 'index.html';
});


});
