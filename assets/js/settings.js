// Variables globales
let currentUser = null;
let userOrders = [];

// Inicializar página de configuración
document.addEventListener('DOMContentLoaded', function () {
    loadUserData().then(() => {
        return loadUserOrders();
    }).then(() => {
        renderSettings();
    });
});

// Cargar datos del usuario desde sessionStorage
async function loadUserData() {
    const userData = sessionStorage.getItem('user');

    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            console.log('Usuario cargado:', currentUser);
        } catch (e) {
            console.error('Error al parsear usuario:', e);
            setMockUserData();
        }
    } else {
        console.log('No hay usuario logueado, mostrando datos mock');
        setMockUserData();
    }
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

// NUEVA FUNCIÓN: Cargar pedidos del usuario
async function loadUserOrders() {
    if (!currentUser || !currentUser.uid) {
        console.log('No hay usuario para cargar pedidos');
        userOrders = [];
        return;
    }

    try {
        // Intentar importar dinámicamente getUserOrders de firebase.js
        const { getUserOrders } = await import('./firebase.js');
        userOrders = await getUserOrders(currentUser.uid);
        console.log('Pedidos cargados:', userOrders.length);
    } catch (error) {
        console.error('Error cargando pedidos, usando datos mock:', error);
        // Datos mock para demostración
        userOrders = [
            {
                id: 'A1234',
                date: '2026-03-15T10:30:00.000Z',
                status: 'entregado',
                total: 48.90,
                items: [
                    { name: 'Camisa', price: 25.00, quantity: 1 },
                    { name: 'Pantalón', price: 23.90, quantity: 1 }
                ]
            },
            {
                id: 'B5678',
                date: '2026-03-10T14:20:00.000Z',
                status: 'enviado',
                total: 41.90,
                items: [
                    { name: 'Vestido', price: 35.00, quantity: 1 },
                    { name: 'Cinturón', price: 6.90, quantity: 1 }
                ]
            },
            {
                id: 'C9012',
                date: '2026-03-05T09:15:00.000Z',
                status: 'pendiente',
                total: 30.00,
                items: [
                    { name: 'Zapatos', price: 30.00, quantity: 1 }
                ]
            }
        ];
    }
}

// Formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Obtener clase de estado
function getStatusClass(status) {
    const statusMap = {
        'pendiente': 'status-pending',
        'procesando': 'status-processing',
        'enviado': 'status-shipped',
        'entregado': 'status-delivered',
        'cancelado': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
}

// Obtener texto de estado
function getStatusText(status) {
    const statusMap = {
        'pendiente': 'Pendiente de pago',
        'procesando': 'En proceso',
        'enviado': 'En camino',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
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

    // Calcular estadísticas reales de pedidos
    const ordersCount = userOrders.length;
    const completedOrders = userOrders.filter(order => order.status === 'entregado').length;
    const totalSpent = userOrders
        .filter(order => order.status === 'entregado')
        .reduce((sum, order) => sum + (order.total || 0), 0);

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
                <span class="stat-label">Pedidos</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${completedOrders}</span>
                <span class="stat-label">Completados</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">$${totalSpent.toFixed(2)}</span>
                <span class="stat-label">Gastado</span>
            </div>
        </div>
    `;
}

// Función global para manejar error de imagen
window.handleImageError = function (img, initials) {
    const container = img.parentElement;
    if (container) {
        img.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'avatar-fallback';
        fallback.textContent = initials;
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.appendChild(fallback);
    }
};

// NUEVA FUNCIÓN: Renderizar historial de pedidos
function renderOrdersHistory() {
    if (!userOrders || userOrders.length === 0) {
        return `
            <div class="no-orders">
                <i class="fa-solid fa-box-open"></i>
                <p>No tienes pedidos aún</p>
                <a href="products.html" class="shop-now-btn">Ir a comprar</a>
            </div>
        `;
    }

    // Ordenar por fecha (más reciente primero)
    const sortedOrders = [...userOrders].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    let html = '<div class="orders-search"><i class="fa-solid fa-search"></i><input type="text" placeholder="Buscar por fecha, estado o ID de orden" id="order-search"></div>';
    html += '<div class="orders-list" id="orders-list">';

    sortedOrders.forEach(order => {
        const orderId = order.id ? order.id.slice(-6).toUpperCase() : 'N/A';
        const date = formatDate(order.date);
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const itemsCount = order.items ? order.items.length : 0;
        const firstItems = order.items ? order.items.slice(0, 2).map(i => i.name).join(', ') : '';
        const hasMore = order.items && order.items.length > 2;

        html += `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-id">
                        <i class="fa-solid fa-receipt"></i>
                        Pedido #${orderId}
                    </div>
                    <div class="order-date">${date}</div>
                </div>
                <div class="order-status ${statusClass}">
                    <span class="status-dot"></span>
                    ${statusText}
                </div>
                <div class="order-items-summary">
                    ${itemsCount} items: ${firstItems} ${hasMore ? '...' : ''}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: $${order.total.toFixed(2)}</div>
                    <div class="order-actions">
                        <button onclick="viewOrderDetails('${order.id}')" class="order-action-btn" title="Ver detalles del pedido">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button onclick="reorderItems('${order.id}')" class="order-action-btn primary" title="Reordenar productos">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';

    // Calcular totales
    const totalSpentAll = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalItemsAll = userOrders.reduce((sum, order) => sum + (order.items ? order.items.length : 0), 0);

    html += `
        <div class="orders-summary">
            <div class="summary-row">
                <span>Total gastado:</span>
                <span>$${totalSpentAll.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Total items:</span>
                <span>${totalItemsAll}</span>
            </div>
        </div>
        <a href="#" class="view-all-link" onclick="viewAllOrders(); return false;">
            Ver Historial Completo <i class="fa-solid fa-arrow-right"></i>
        </a>
    `;

    return html;
}

// Función para filtrar pedidos
function filterOrders(searchTerm) {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    const cards = ordersList.querySelectorAll('.order-card');
    const term = searchTerm.toLowerCase();

    cards.forEach(card => {
        const orderId = card.querySelector('.order-id').textContent.toLowerCase();
        const date = card.querySelector('.order-date').textContent.toLowerCase();
        const status = card.querySelector('.order-status').textContent.toLowerCase();
        const items = card.querySelector('.order-items-summary').textContent.toLowerCase();

        if (orderId.includes(term) || date.includes(term) || status.includes(term) || items.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Renderizar opciones de configuración
function renderSettings() {
    const settingsContainer = document.querySelector('.settings-container');
    if (!settingsContainer) return;

    // Determinar si hay usuario logueado (no es usuario mock)
    const isLoggedIn = currentUser && currentUser.uid && currentUser.uid !== "mock-user-123";

    // Generar botón según estado de sesión
    const authButton = isLoggedIn ? `
        <button class="logout-button" onclick="logout()">
            <i class="fa-solid fa-sign-out-alt"></i>
            Cerrar sesión
        </button>
    ` : `
        <button class="login-button" onclick="redirectToLogin()">
            <i class="fa-solid fa-sign-in-alt"></i>
            Iniciar sesión
        </button>
    `;

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
                <i class="fa-solid fa-clock-rotate-left"></i>
                Mis Compras
            </h3>
            ${renderOrdersHistory()}
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

        ${authButton}
    `;

    settingsContainer.innerHTML = settingsHTML;

    renderUserProfile();

    // Agregar event listener para búsqueda después de renderizar
    setTimeout(() => {
        const searchInput = document.getElementById('order-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => filterOrders(e.target.value));
        }
    }, 100);
}

// NUEVAS FUNCIONES GLOBALES
window.viewOrderDetails = function (orderId) {
    console.log('Ver detalles de orden:', orderId);
    showNotification(`Mostrando detalles del pedido #${orderId.slice(-6)}`, '#79b1b7');
    // Aquí implementarías la navegación a una página de detalles
};

window.reorderItems = async function (orderId) {
    console.log('Reordenar items de orden:', orderId);
    const order = userOrders.find(o => o.id === orderId);
    if (order && order.items) {
        // Obtener carrito actual
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // Agregar items al carrito
        order.items.forEach(item => {
            cart.push({
                ...item,
                quantity: item.quantity || 1,
                selectedSize: item.selectedSize || 'M'
            });
        });

        // Guardar en sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));

        showNotification('Productos agregados al carrito', '#79b1b7');
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 1500);
    }
};

window.viewAllOrders = function () {
    console.log('Ver historial completo');
    showNotification('Mostrando historial completo', '#79b1b7');
    // Aquí implementarías la navegación a una página de historial completo
};

// Nueva función para redirigir al login
window.redirectToLogin = function () {
    console.log('Redirigiendo a login');
    showNotification('Redirigiendo a iniciar sesión...', '#79b1b7');
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 500);
};

// Función de navegación
function navigateTo(section) {
    console.log('Navegando a:', section);
    showNotification(`Sección: ${section}`);
}

// Función de logout
function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('likes');
    showNotification('Sesión cerrada', '#ff4444');
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