import { createUser } from './firebase.js';

const signupForm = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const passwordError = document.getElementById('password-error');
const contactError = document.getElementById('contact-error');

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

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar teléfono
function isValidPhone(phone) {
    const simplePhoneRegex = /^[+]?[\d\s-]{8,}$/;
    return simplePhoneRegex.test(phone);
}

// Función para limpiar errores visuales
function clearFieldErrors() {
    document.querySelectorAll('.input-container input.error').forEach(input => {
        input.classList.remove('error');
    });
}

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

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar errores anteriores
    clearFieldErrors();

    const name = signupForm['name'].value.trim();
    const email = signupForm['email'].value.trim();
    const phone = signupForm['phone'].value.trim();
    const password = signupForm['password'].value;
    const confirmPassword = signupForm['confirm-password'].value;

    // Validar que el nombre no esté vacío
    if (!name) {
        showNotification('Por favor, ingresa tu nombre completo', false);
        return;
    }

    // Validar que al menos email o teléfono estén presentes
    if (!email && !phone) {
        contactError.style.display = 'block';
        showNotification('Debes proporcionar al menos un correo o un teléfono', false);

        // Marcar visualmente los campos vacíos
        if (!email) document.getElementById('email').classList.add('error');
        if (!phone) document.getElementById('phone').classList.add('error');
        return;
    }

    // Validar formato de email si se proporcionó
    if (email && !isValidEmail(email)) {
        contactError.style.display = 'none';
        showNotification('Por favor, ingresa un correo electrónico válido', false);
        document.getElementById('email').classList.add('error');
        return;
    }

    // Validar formato de teléfono si se proporcionó
    if (phone && !isValidPhone(phone)) {
        contactError.style.display = 'none';
        showNotification('Por favor, ingresa un teléfono válido', false);
        document.getElementById('phone').classList.add('error');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        passwordError.style.display = 'block';
        contactError.style.display = 'none';
        showNotification('Las contraseñas no coinciden', false);
        return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
        passwordError.style.display = 'none';
        contactError.style.display = 'none';
        showNotification('La contraseña debe tener al menos 6 caracteres', false);
        return;
    }

    // Ocultar mensajes de error
    passwordError.style.display = 'none';
    contactError.style.display = 'none';

    // Mostrar estado de carga
    setLoading(true);

    // Preparar datos del usuario
    const user = {
        name: name,
        email: email || null,
        phone: phone || null,
        password: password
    };

    try {
        const result = await createUser(user);

        if (result && result.success) {
            showNotification('¡Registro exitoso! Redirigiendo...', true);
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 1500);
        } else {
            setLoading(false);
            showNotification('Error en el registro. Intenta de nuevo.', false);
        }
    } catch (error) {
        setLoading(false);

        // Manejar errores específicos de Firebase
        if (error.code === 'auth/email-already-in-use') {
            showNotification('Este correo ya está registrado', false);
        } else if (error.code === 'auth/invalid-email') {
            showNotification('Correo electrónico inválido', false);
        } else if (error.code === 'auth/weak-password') {
            showNotification('La contraseña es demasiado débil', false);
        } else {
            showNotification('Error al conectar con el servidor. Intenta de nuevo.', false);
        }

        console.error("Error en registro:", error);
    }
});

// Validación en tiempo real para mejorar UX
document.getElementById('email').addEventListener('input', function () {
    if (this.value.trim()) {
        document.getElementById('phone').classList.remove('error');
        contactError.style.display = 'none';
    }
});

document.getElementById('phone').addEventListener('input', function () {
    if (this.value.trim()) {
        document.getElementById('email').classList.remove('error');
        contactError.style.display = 'none';
    }
});