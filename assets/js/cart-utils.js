// cart-utils.js - Funciones compartidas para el carrito

// Obtener carrito
function getCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

// Guardar carrito
function saveCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Calcular total
function calculateTotal(cart) {
    let total = 0;
    cart.forEach(item => {
        total += item.price * (item.quantity || 1);
    });
    return total.toFixed(2);
}

// Mostrar notificación de agregado al carrito
function showAddToCartNotification(productName) {
    // Eliminar notificaciones existentes
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fa-solid fa-check-circle"></i>
        <span>${productName} agregado al carrito</span>
    `;

    notification.style.position = 'fixed';
    notification.style.bottom = '80px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#79b1b7';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '30px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    notification.style.zIndex = '3000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.animation = 'slideUp 0.3s ease';

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

// Actualizar contador del carrito (si existe)
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Función unificada para agregar al carrito
function addToCart(productId, selectedSize = null) {
    const products = JSON.parse(sessionStorage.getItem('productsJson'));
    const product = products.find(p => p.id === productId);

    if (!product) return;

    let cart = getCart();

    // Verificar si el producto ya existe
    const existingProduct = cart.find(p => p.id === productId);

    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        // Si se proporciona una talla, actualizarla
        if (selectedSize) {
            existingProduct.selectedSize = selectedSize;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1,
            selectedSize: selectedSize || product.size || 'M'
        });
    }

    saveCart(cart);
    updateCartCounter();
    showAddToCartNotification(product.name);

    // Si estamos en la página de órdenes, actualizar la vista
    if (window.location.pathname.includes('orders.html')) {
        if (typeof renderCartSection === 'function') {
            renderCartSection();
        }
    }
}

// Función para eliminar del carrito
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(p => p.id !== productId);
    saveCart(cart);
    updateCartCounter();

    // Si estamos en la página de órdenes, actualizar la vista
    if (window.location.pathname.includes('orders.html')) {
        if (typeof renderCartSection === 'function') {
            renderCartSection();
        }
    }
}

// Función para agregar desde el modal (con talla seleccionada)
function addToCartFromModal(productId) {
    const selectedSize = window.selectedSize || 'M';
    addToCart(productId, selectedSize);
    closeProductModal();
}

// Función para obtener producto por ID
function getProductById(productId) {
    const products = JSON.parse(sessionStorage.getItem('productsJson'));
    if (products) {
        return products.find(p => p.id === productId) || null;
    }
    return null;
}

// Hacer funciones globales
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToCartFromModal = addToCartFromModal;
window.updateCartCounter = updateCartCounter;
window.getProductById = getProductById;