// Función para actualizar el resaltado del carrito
function updateCartHighlight() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartNavItem = document.querySelector('a[href="orders.html"]');

    if (!cartNavItem) return;

    // Remover clase highlight existente
    cartNavItem.classList.remove('cart-highlight');

    // Remover badge existente si lo hay
    const existingBadge = cartNavItem.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Si hay productos en el carrito, resaltar
    if (cart.length > 0) {
        cartNavItem.classList.add('cart-highlight');

        // Calcular cantidad total de items
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        // Crear y añadir badge
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems > 9 ? '9+' : totalItems;
        cartNavItem.style.position = 'relative';
        cartNavItem.appendChild(badge);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', updateCartHighlight);

// Actualizar cuando se modifica el carrito
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
        updateCartHighlight();
    }
});

// Interceptar setItem de sessionStorage
const originalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (key === 'cart') {
        updateCartHighlight();
    }
};