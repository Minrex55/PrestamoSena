document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    // Referencias a los campos HTML
    const nombreInput = document.getElementById('nombre');
    const documentoInput = document.getElementById('documento');
    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar recarga de página
        
        let valid = true;

        // --- VALIDACIONES VISUALES (FRONTEND) ---
        // Estas validaciones evitan enviar datos basura al servidor

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
        // Tu backend pide entre 8 y 10 dígitos
        if (documentoValor.length < 8 || documentoValor.length > 10 || isNaN(documentoValor)) {
            mostrarError(documentoInput, 'Debe contener entre 8 y 10 números');
            valid = false;
        } else {
            limpiarError(documentoInput);
        }

        // 3. Validar Teléfono
        const telefonoValor = telefonoInput.value.trim();
        // Tu backend acepta entre 7 y 15, pero tu HTML dice "exactamente 10". 
        // Dejaremos la validación estricta de 10 dígitos del frontend.
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
        const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passValor); // Mismos caracteres que tu backend
        const longMin = passValor.length >= 8;

        if (!(tieneMayus && tieneNum && tieneEspecial && longMin)) {
            mostrarError(passwordInput, 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
            valid = false;
        } else {
            limpiarError(passwordInput);
        }

        // --- ENVÍO DE DATOS AL SERVIDOR ---
        if (valid) {
            
            // IMPORTANTE: Mapeo de datos según tu CrearInvitadoControlador.js
            // t1: documento, t2: nombres, t3: telefono, t4: correo, t5: contrasena
            const datosParaEnviar = {
                t1: documentoInput.value.trim(), // Documento
                t2: nombreInput.value.trim(),    // Nombres
                t3: telefonoInput.value.trim(),  // Teléfono
                t4: emailInput.value.trim(),     // Correo
                t5: passwordInput.value          // Contraseña
            };

            try {
                // Asegúrate que el puerto sea el correcto (ej: 3000)
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
                    // ÉXITO: Código 201
                    alert('¡Registro Exitoso! Serás redirigido al login.');
                    registerForm.reset();
                    
                    // Redirección al Login para obtener el Token
                    window.location.href = './login.html';
                } else {
                    // ERROR: Código 400 o 409 (Datos inválidos o Usuario ya existe)
                    // Mostramos el mensaje que viene del servidor (ej: "El correo ya existe")
                    alert('Error: ' + (data.mensaje || 'Ocurrió un error al registrar.'));
                }

            } catch (error) {
                console.error('Error de red:', error);
                alert('No se pudo conectar con el servidor. Verifica que esté encendido.');
            }
        }
    });

    // Funciones visuales para poner/quitar el borde rojo
    function mostrarError(input, mensaje) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('.error-message');
        small.innerText = mensaje;
        formControl.className = 'input-group error';
    }

    function limpiarError(input) {
        const formControl = input.parentElement;
        formControl.className = 'input-group';
    }
});