document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    // Referencias a los campos
    const nombreInput = document.getElementById('nombre');
    const documentoInput = document.getElementById('documento');
    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar envío automático
        
        let valid = true;

        // 1. Validar Nombre (Mínimo 3 letras)
        // La regex permite letras mayúsculas, minúsculas y espacios
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        if (!nombreRegex.test(nombreInput.value.trim())) {
            mostrarError(nombreInput, 'El nombre debe tener al menos 3 letras.');
            valid = false;
        } else {
            limpiarError(nombreInput);
        }

        // 2. Validar Documento (8 a 10 números)
        const documentoValor = documentoInput.value.trim();
        if (documentoValor.length < 8 || documentoValor.length > 10 || isNaN(documentoValor)) {
            mostrarError(documentoInput, 'Solo puede contener numeros y debe tener entre 8 y 10 digitos');
            valid = false;
        } else {
            limpiarError(documentoInput);
        }

        // 3. Validar Teléfono (Exactamente 10 números)
        const telefonoValor = telefonoInput.value.trim();
        // Regex: ^\d{10}$ significa exactamente 10 dígitos
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
        // Mínimo 8, 1 Especial, 1 Mayúscula, 1 Número
        const passValor = passwordInput.value;
        const tieneMayus = /[A-Z]/.test(passValor);
        const tieneNum = /[0-9]/.test(passValor);
        // Caracteres especiales comunes: !@#$%^&*
        const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passValor);
        const longMin = passValor.length >= 8;

        if (!(tieneMayus && tieneNum && tieneEspecial && longMin)) {
            mostrarError(passwordInput, 'Debe tener mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
            valid = false;
        } else {
            limpiarError(passwordInput);
        }

        // Si todo es válido
        if (valid) {
            alert('¡Registro Exitoso! Redirigiendo al login...');
            registerForm.reset();
            window.location.href = './index.html';
        }
    });

    // Función auxiliar para mostrar error visualmente
    function mostrarError(input, mensaje) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('.error-message');
        
        // Agregamos el mensaje dentro del tag small
        small.innerText = mensaje;
        
        // Añadimos la clase de error para poner el borde rojo
        formControl.className = 'input-group error';
    }

    // Función para limpiar el error
    function limpiarError(input) {
        const formControl = input.parentElement;
        formControl.className = 'input-group';
    }

    
});

