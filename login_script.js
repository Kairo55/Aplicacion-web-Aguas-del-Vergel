document.addEventListener('DOMContentLoaded', function() {
    // Selecciona el formulario por su ID
    const loginForm = document.getElementById('loginForm');

    // Asegúrate de que el formulario exista en la página
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Previene la acción por defecto del formulario (que es recargar la página)
            event.preventDefault();

            // Obtiene los campos de usuario y contraseña por sus IDs
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            // Obtiene los valores de los campos y quita espacios en blanco al inicio/final
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Verifica que ambos campos tengan algún valor
            if (username !== '' && password !== '') {
                // Si ambos campos tienen valor, redirige al panel principal.
                // Asegúrate de que 'usuario.html' sea el nombre correcto de tu archivo del panel
                // y que esté en la misma carpeta, o ajusta la ruta.
                console.log('Inicio de sesión simulado exitoso. Redirigiendo...');
                window.location.href = 'usuario.html';
            } else {
                // Si uno o ambos campos están vacíos, muestra una alerta.
                alert('Por favor, ingrese su usuario y contraseña.');
            }
        });
    } else {
        console.error('Error: El formulario con id "loginForm" no fue encontrado.');
    }
});