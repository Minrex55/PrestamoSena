document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        // Prevenir el recargo de la página por defecto
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validación simple (adicional al 'required' de HTML)
        if (email.trim() === '' || password.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Simulación de inicio de sesión
        // Aquí conectarías con tu Backend real
        console.log('Iniciando sesión con:', email);

        // Redireccionar al index.html principal
        window.location.href = './index.html';
    });

    
});