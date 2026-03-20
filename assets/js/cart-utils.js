// cart-utils.js - Funciones compartidas para el carrito

// Obtener carrito
function getCart() {
    const cartStr = sessionStorage.getItem('cart');
    console.log('🔍 getCart:', cartStr);
    return cartStr ? JSON.parse(cartStr) : [];
}

// Guardar carrito
function saveCart(cart) {
    console.log('💾 saveCart:', cart);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    console.log('💾 Verificación:', sessionStorage.getItem('cart'));

    // Disparar evento
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: cart } }));
}

// Calcular total
function calculateTotal(cart) {
    let total = 0;
    cart.forEach(item => {
        total += item.price * (item.quantity || 1);
    });
    return total.toFixed(2);
}

// Mostrar notificación
function showAddToCartNotification(productName) {
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
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Actualizar contador
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Función principal para agregar al carrito
function addToCart(productId, selectedSize = null) {
    console.log('🔵 addToCart:', productId, selectedSize);

    // Obtener productos
    const productsJson = sessionStorage.getItem('productsJson');
    if (!productsJson) {
        console.error('❌ No hay productsJson');
        return;
    }

    const products = JSON.parse(productsJson);
    const product = products.find(p => Number(p.id) === Number(productId));

    if (!product) {
        console.error('❌ Producto no encontrado:', productId);
        return;
    }

    // Obtener carrito actual
    let cart = getCart();
    console.log('🛒 Carrito actual:', cart);

    // Buscar si ya existe
    const existingIndex = cart.findIndex(p => Number(p.id) === Number(productId));

    if (existingIndex !== -1) {
        // Incrementar cantidad
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        console.log('📈 Producto existente, nueva cantidad:', cart[existingIndex].quantity);
    } else {
        // Agregar nuevo
        const newProduct = {
            id: product.id,
            category_id: product.category_id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            size: product.size,
            selectedSize: selectedSize || product.size || 'M',
            quantity: 1
        };
        cart.push(newProduct);
        console.log('🆕 Nuevo producto agregado:', newProduct.name);
    }

    // Guardar
    saveCart(cart);
    updateCartCounter();
    showAddToCartNotification(product.name);
}

// Eliminar del carrito
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(p => Number(p.id) !== Number(productId));
    saveCart(cart);
    updateCartCounter();
}

// Agregar desde modal
function addToCartFromModal(productId) {
    const selectedSize = window.selectedSize || 'M';
    addToCart(productId, selectedSize);
    if (typeof closeProductModal === 'function') closeProductModal();
}

// Obtener producto por ID
function getProductById(productId) {
    const products = JSON.parse(sessionStorage.getItem('productsJson'));
    if (products) {
        return products.find(p => Number(p.id) === Number(productId)) || null;
    }
    return null;
}

// Funciones globales
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToCartFromModal = addToCartFromModal;
window.updateCartCounter = updateCartCounter;
window.getProductById = getProductById;