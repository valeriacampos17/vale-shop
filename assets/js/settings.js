// Variables globales
let currentUser = null;

// Inicializar página de configuración
document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    renderSettings();
});

// Cargar datos del usuario desde sessionStorage
function loadUserData() {
    // Intentar obtener usuario de sessionStorage
    const userData = sessionStorage.getItem('user');

    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            console.log('Usuario cargado:', currentUser);
        } catch (e) {
            console.error('Error al parsear usuario:', e);
            // Si hay error, usar datos mock
            setMockUserData();
        }
    } else {
        // No hay usuario logueado, usar datos mock
        console.log('No hay usuario logueado, mostrando datos mock');
        setMockUserData();
    }

    renderUserProfile();
}

// Establecer datos mock para demostración
function setMockUserData() {
    currentUser = {
        uid: "mock-user-123",
        email: "usuario@valeshop.com",
        nombre: "Usuario Demo",
        telefono: "+584241234567",
        fechaRegistro: "2026-01-15T10:30:00.000Z"
    };
}

// Formatear fecha de registro
function formatMemberSince(fechaRegistro) {
    if (!fechaRegistro) return '2026';

    try {
        const date = new Date(fechaRegistro);
        return date.getFullYear().toString();
    } catch (e) {
        return '2026';
    }
}

// Obtener iniciales del nombre
function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Renderizar perfil de usuario
function renderUserProfile() {
    const profileContainer = document.querySelector('.user-profile');
    if (!profileContainer) return;

    const initials = getInitials(currentUser.nombre);
    const memberYear = formatMemberSince(currentUser.fechaRegistro);

    // Valores mock para estadísticas (podrían venir de Firebase)
    const ordersCount = 3; // Esto podría obtenerse de Firebase
    const likesCount = 12; // Esto podría obtenerse de Firebase

    profileContainer.innerHTML = `
        <div class="user-greeting">
            <div class="user-avatar" id="user-avatar-container">
                <img src="assets/image/avatar.webp" alt="Avatar" id="avatar-img" 
                     onerror="handleImageError(this, '${initials}')"
                     style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </div>
            <div>
                <h2>Hola, ${currentUser.nombre || 'Usuario'}</h2>
                <p>${currentUser.email || ''}</p>
                ${currentUser.telefono ? `<p class="user-phone"><i class="fa-solid fa-phone"></i> ${currentUser.telefono}</p>` : ''}
            </div>
        </div>
        <div class="user-stats">
            <div class="stat-item">
                <span class="stat-value">${ordersCount}</span>
                <span class="stat-label">Mis Compras</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${likesCount}</span>
                <span class="stat-label">Favoritos</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${memberYear}</span>
                <span class="stat-label">Miembro</span>
            </div>
        </div>
    `;
}

// Función global para manejar error de imagen
window.handleImageError = function (img, initials) {
    const container = img.parentElement;
    if (container) {
        // Remover la imagen
        img.style.display = 'none';

        // Crear elemento de fallback
        const fallback = document.createElement('div');
        fallback.className = 'avatar-fallback';
        fallback.textContent = initials;

        // Asegurar que el contenedor mantenga sus estilos
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        // Agregar el fallback
        container.appendChild(fallback);
    }
};

// Renderizar opciones de configuración
function renderSettings() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    const settingsHTML = `
        <div class="user-profile"></div>
        
        <div class="settings-section">
            <h3>
                <i class="fa-solid fa-user"></i>
                Mis Datos
            </h3>
            <div class="settings-item" onclick="navigateTo('profile')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-id-card"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Información personal</div>
                    <div class="settings-item-subtitle">Nombre, email, teléfono</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
            <div class="settings-item" onclick="navigateTo('addresses')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Direcciones</div>
                    <div class="settings-item-subtitle">Gestiona tus direcciones</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
            <div class="settings-item" onclick="navigateTo('payment')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-credit-card"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Métodos de pago</div>
                    <div class="settings-item-subtitle">Tarjetas, efectivo</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
        </div>

        <div class="settings-section">
            <h3>
                <i class="fa-solid fa-info-circle"></i>
                Información
            </h3>
            <div class="settings-item" onclick="navigateTo('terms')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-file-contract"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Términos y Condiciones</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
            <div class="settings-item" onclick="navigateTo('security')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Seguridad</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
            <div class="settings-item" onclick="navigateTo('privacy')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Privacidad</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
            <div class="settings-item" onclick="navigateTo('cookies')">
                <div class="settings-item-icon">
                    <i class="fa-solid fa-cookie-bite"></i>
                </div>
                <div class="settings-item-content">
                    <div class="settings-item-title">Cookies</div>
                </div>
                <i class="fa-solid fa-chevron-right settings-item-arrow"></i>
            </div>
        </div>

        <div class="app-version">
            Versión 1.0
        </div>

        <button class="logout-button" onclick="logout()">
            <i class="fa-solid fa-sign-out-alt"></i>
            Cerrar sesión
        </button>
    `;

    settingsContainer.innerHTML = settingsHTML;

    // Renderizar perfil por separado
    renderUserProfile();
}

// Función de navegación
function navigateTo(section) {
    console.log('Navegando a:', section);
    showNotification(`Sección: ${section}`);
}

// Función de logout
function logout() {
    // Limpiar sessionStorage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('likes');

    // Mostrar notificación
    showNotification('Sesión cerrada', '#ff4444');

    // Redirigir al login después de 1 segundo
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 1000);
}

// Función para mostrar notificaciones
function showNotification(message, bgColor = '#79b1b7') {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fa-solid fa-info-circle"></i>
        <span>${message}</span>
    `;
    notification.style.backgroundColor = bgColor;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Verificar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}