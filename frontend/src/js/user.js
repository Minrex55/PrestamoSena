document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. CAPTURAMOS TODOS LOS ELEMENTOS
    // ---------------------------------------------------------
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    const form = document.getElementById('updateForm');
    const documentoInput = document.getElementById('documento');
    const nombreInput = document.getElementById('nombres');
    const correoInput = document.getElementById('correo');
    const telefonoInput = document.getElementById('telefono');
    const passInput = document.getElementById('password');
    const confirmPassInput = document.getElementById('confirm_password');
    const togglePassBtn = document.getElementById('togglePassBtn');

    // ---------------------------------------------------------
    // 2. AUTO-RELLENAMOS LOS DATOS
    // ---------------------------------------------------------
    const usuarioActual = {
        documento: "1095556677",
        nombres: "Andrés Felipe García",
        correo: "afgarcia@misena.edu.co",
        telefono: "3102223344"
    };

    function cargarDatos() {
        if(documentoInput) documentoInput.value = usuarioActual.documento;
        if(nombreInput)    nombreInput.value = usuarioActual.nombres;
        if(correoInput)    correoInput.value = usuarioActual.correo;
        if(telefonoInput)  telefonoInput.value = usuarioActual.telefono;
    }
    
    cargarDatos();

    // ---------------------------------------------------------
    // 3. LÓGICA DEL MENÚ
    // ---------------------------------------------------------
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) toggleMenu();
        });
    }

    // ---------------------------------------------------------
    // 4. EXPRESIONES REGULARES
    // ---------------------------------------------------------
    const regexList = {
        documento: /^\d{7,12}$/,
        nombre: /^.{3,}$/,
        correo: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        telefono: /^\d{10}$/,
        pass: {
            len: 8,
            upper: /[A-Z]/,
            num: /\d/,
            sym: /[!@#$%^&*(),.?":{}|<>]/
        }
    };

    // ---------------------------------------------------------
    // 5. FUNCIÓN DE VALIDACIÓN
    // ---------------------------------------------------------
    function validateInput(input, regex, errorId, msg) {
        const errorEl = document.getElementById(errorId);
        const value = input.value.trim();
        
        if (value === '' && !input.required) {
            input.classList.remove('invalid', 'valid');
            errorEl.classList.remove('visible');
            return true;
        }

        if (!regex.test(value)) {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorEl.textContent = msg;
            errorEl.classList.add('visible');
            return false;
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
            errorEl.classList.remove('visible');
            return true;
        }
    }

    // ---------------------------------------------------------
    // 6. LISTENERS DE VALIDACIÓN
    // ---------------------------------------------------------
    
    // Documento
    documentoInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        validateInput(documentoInput, regexList.documento, 'error-documento', 'Ingrese un documento válido (7-12 dígitos).');
    });
    
    // Nombre
    nombreInput.addEventListener('input', () => {
        validateInput(nombreInput, regexList.nombre, 'error-nombres', 'Ingrese al menos 3 caracteres.');
    });

    // Teléfono
    telefonoInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        validateInput(telefonoInput, regexList.telefono, 'error-telefono', 'Debe tener 10 dígitos numéricos.');
    });

    // Correo
    correoInput.addEventListener('input', () => {
        validateInput(correoInput, regexList.correo, 'error-correo', 'Formato de correo inválido.');
    });

    // Contraseña
    passInput.addEventListener('input', (e) => {
        const val = e.target.value;
        
        const reqs = {
            len: val.length >= regexList.pass.len,
            upper: regexList.pass.upper.test(val),
            num: regexList.pass.num.test(val),
            sym: regexList.pass.sym.test(val)
        };

        updatePassUI('req-len', reqs.len);
        updatePassUI('req-upper', reqs.upper);
        updatePassUI('req-num', reqs.num);
        updatePassUI('req-sym', reqs.sym);

        if (confirmPassInput.value !== '') checkMatch();
    });

    function updatePassUI(elementId, isValid) {
        const el = document.getElementById(elementId);
        const icon = el.querySelector('i');
        
        if (isValid) {
            el.classList.add('valid');
            el.classList.remove('invalid');
            icon.className = 'fas fa-check';
        } else {
            el.classList.remove('valid');
            if (passInput.value.length > 0) el.classList.add('invalid');
            icon.className = 'fas fa-circle';
        }
    }

    // Confirmar Contraseña
    confirmPassInput.addEventListener('input', checkMatch);

    function checkMatch() {
        const errorEl = document.getElementById('error-confirm');
        if (passInput.value !== confirmPassInput.value) {
            confirmPassInput.classList.add('invalid');
            confirmPassInput.classList.remove('valid');
            errorEl.textContent = 'Las contraseñas no coinciden.';
            errorEl.classList.add('visible');
            return false;
        } else {
            confirmPassInput.classList.remove('invalid');
            if(confirmPassInput.value !== '') confirmPassInput.classList.add('valid');
            errorEl.classList.remove('visible');
            return true;
        }
    }

    // Toggle Mostrar/Ocultar Contraseña
    togglePassBtn.addEventListener('click', () => {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        confirmPassInput.setAttribute('type', type);
        
        togglePassBtn.classList.toggle('fa-eye');
        togglePassBtn.classList.toggle('fa-eye-slash');
    });

    // ---------------------------------------------------------
    // 7. ENVÍO DEL FORMULARIO
    // ---------------------------------------------------------
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isDocValid = validateInput(documentoInput, regexList.documento, 'error-documento', 'Documento inválido.');
        const isNameValid = validateInput(nombreInput, regexList.nombre, 'error-nombres', 'Mínimo 3 letras.');
        const isPhoneValid = validateInput(telefonoInput, regexList.telefono, 'error-telefono', '10 dígitos requeridos.');
        const isEmailValid = validateInput(correoInput, regexList.correo, 'error-correo', 'Correo inválido.');

        let isPassValid = true;
        if (passInput.value !== '') {
            const val = passInput.value;
            const allReqsMet = (val.length >= 8) && 
                               regexList.pass.upper.test(val) && 
                               regexList.pass.num.test(val) && 
                               regexList.pass.sym.test(val);
            
            if (!allReqsMet) {
                alert('La contraseña no cumple con todos los requisitos de seguridad.');
                isPassValid = false;
            } else {
                isPassValid = checkMatch();
            }
        }

        if (isDocValid && isNameValid && isPhoneValid && isEmailValid && isPassValid) {
            console.log('Formulario válido. Enviando datos...');
            alert('¡Información actualizada correctamente!');
            form.reset();
            document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
        } else {
            alert('Por favor revise los campos marcados en rojo.');
        }
    });
});