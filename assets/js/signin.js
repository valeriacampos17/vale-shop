import { signIn, getCurrentUser } from './firebase.js';

const signinForm = document.getElementById('signin-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Función para mostrar notificación (igual que en modal.js)
function showNotification(message, isSuccess = true) {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.auth-notification, .cart-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `auth-notification ${isSuccess ? 'success' : 'error'}`;
    notification.style.position = 'fixed';
    notification.style.bottom = '80px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = isSuccess ? '#79b1b7' : '#ff4444';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '30px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    notification.style.zIndex = '3000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'center';
    notification.style.gap = '10px';
    notification.style.fontSize = '16px';
    notification.style.whiteSpace = 'nowrap';
    notification.style.animation = 'slideUp 0.3s ease';

    if (isSuccess) {
        notification.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            <span>${message}</span>
        `;
    } else {
        notification.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>${message}</span>
        `;
    }

    document.body.appendChild(notification);

    // Remover después de 2 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Verificar si ya hay un usuario logueado
const currentUser = getCurrentUser();
if (currentUser) {
    // Si ya hay sesión, redirigir al index
    window.location.href = 'index.html';
}

const getPathname = () => {
    try {
        const referrer = document.referrer;
        if (referrer) {
            const filename = new URL(referrer).pathname.split('/').pop();
            return filename !== 'signup.html' ? filename : sessionStorage.getItem('pathname');
        }
        return sessionStorage.getItem('pathname') || 'index.html';
    } catch {
        return sessionStorage.getItem('pathname') || 'index.html';
    }
};

const pathname = getPathname();
sessionStorage.setItem('pathname', pathname);

// Función para mostrar estado de carga
const setLoading = (isLoading) => {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
};

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signinForm['email'].value.trim();
    const password = signinForm['password'].value.trim();

    // Validación básica
    if (!email || !password) {
        showNotification('Por favor, completa todos los campos', false);
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor, ingresa un correo electrónico válido', false);
        return;
    }

    // Mostrar estado de carga
    setLoading(true);

    try {
        const login = await signIn(email, password);

        if (login) {
            // Mostrar mensaje de éxito
            showNotification('¡Inicio de sesión exitoso!', true);

            // Obtener el usuario
            const user = getCurrentUser();

            // Pequeño retraso para mostrar la notificación
            setTimeout(() => {
                // CAMBIO: Siempre redirigir a la vista anterior
                // No importa si el perfil está incompleto
                window.location.href = pathname;
            }, 1500);
        } else {
            setLoading(false);
            showNotification('Error al iniciar sesión. Verifica tus credenciales.', false);
            console.error("Login failed");
        }
    } catch (error) {
        setLoading(false);
        showNotification('Error al conectar con el servidor. Intenta de nuevo.', false);
        console.error("Error en login:", error);
    }
});