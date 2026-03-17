// Función para actualizar el badge del carrito
function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartNavItem = document.querySelector('a[href="orders.html"]');

    if (!cartNavItem) return;

    // Remover badge existente si lo hay
    const existingBadge = cartNavItem.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Si hay productos en el carrito, añadir badge
    if (cart.length > 0) {
        // Calcular cantidad total de items
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        // Crear y añadir badge
        const badge = document.createElement('span');
        badge.className = 'cart-badge new'; // Añadir clase 'new' para animación de entrada
        badge.textContent = totalItems > 99 ? '99+' : totalItems; // Soporte para números grandes
        cartNavItem.style.position = 'relative';
        cartNavItem.appendChild(badge);

        // Quitar la clase 'new' después de la animación
        setTimeout(() => {
            badge.classList.remove('new');
        }, 300);
    }
}

// Función para marcar el item activo según la página actual
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('active');

        if (href === currentPage) {
            item.classList.add('active');
        }

        // Caso especial para index.html
        if (currentPage === '' || currentPage === 'index.html' && href === 'index.html') {
            if (item.getAttribute('href') === 'index.html') {
                item.classList.add('active');
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavItem();
    updateCartBadge();
});

// Actualizar cuando se modifica el carrito
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
        updateCartBadge();
    }
});

// Interceptar setItem de sessionStorage para actualizar en tiempo real
const originalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (key === 'cart') {
        updateCartBadge();
    }
};

// También actualizar cuando la página se carga con datos nuevos
window.addEventListener('pageshow', () => {
    setActiveNavItem();
    updateCartBadge();
});