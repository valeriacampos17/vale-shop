var productModal = document.getElementById("product-modal");
var ordersModal = document.getElementById("orders-modal");

// ELIMINADA la declaración duplicada de selectedSize
// Ahora se usará la variable global de products.js

function showProductModal(id) {
    renderProductsModal(id);
    productModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevenir scroll detrás del modal
}

function closeProductModal() {
    if (productModal) {
        productModal.style.display = "none";
        document.body.style.overflow = ""; // Restaurar scroll
    }
}

function showOrdersModal() {
    const user = sessionStorage.getItem('user');

    if (!user) {
        window.location.href = 'signin.html';
    } else {
        ordersModal.style.display = 'block';
        document.body.style.overflow = "hidden";
    }
}

function closeOrdersModal() {
    if (ordersModal) {
        ordersModal.style.display = 'none';
        document.body.style.overflow = "";
    }
}

// Función para seleccionar talla - AHORA USA window.selectedSize
function selectSize(sizeElement, size) {
    // Remover clase selected de todas las opciones
    document.querySelectorAll('.size-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Agregar clase selected a la opción clickeada
    sizeElement.classList.add('selected');

    // Guardar la talla seleccionada en la variable global de products.js
    if (typeof window.selectedSize !== 'undefined') {
        window.selectedSize = size;
    } else {
        // Fallback si no existe window.selectedSize
        window.selectedSize = size;
    }
    console.log('Talla seleccionada:', window.selectedSize);
}

// Función mejorada para agregar al carrito desde el modal
function addToCartFromModal(productId) {
    const products = JSON.parse(sessionStorage.getItem('productsJson'));
    const product = products.find(p => p.id === productId);

    if (product) {
        // Usar window.selectedSize
        const currentSize = window.selectedSize || 'M';

        // Agregar la talla seleccionada al producto
        const productWithSize = {
            ...product,
            selectedSize: currentSize,
            quantity: 1
        };

        // Obtener carrito actual
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.findIndex(p => p.id === productId && p.selectedSize === currentSize);

        if (existingProductIndex >= 0) {
            // Incrementar cantidad si ya existe
            cart[existingProductIndex].quantity += 1;
        } else {
            // Agregar nuevo producto
            cart.push(productWithSize);
        }

        // Guardar en sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));

        // Mostrar confirmación
        showAddToCartConfirmation(product.name);

        // Actualizar contador del carrito si existe
        updateCartCounter();
    }
}

// Función para mostrar confirmación al agregar al carrito
function showAddToCartConfirmation(productName) {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fa-solid fa-check-circle"></i>
        <span>${productName} agregado al carrito</span>
    `;

    // Estilos para la notificación
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

// Función para actualizar contador del carrito (si existe en el header)
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Función para agregar a likes desde el modal
function addToLikesFromModal(productId, element) {
    const products = JSON.parse(sessionStorage.getItem('productsJson'));
    const product = products.find(p => p.id === productId);

    if (product) {
        // Obtener likes actuales
        let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

        // Verificar si ya está en likes
        const existingIndex = likes.findIndex(p => p.id === productId);

        if (existingIndex >= 0) {
            // Remover de likes
            likes.splice(existingIndex, 1);
            element.classList.remove('liked');
        } else {
            // Agregar a likes
            likes.push(product);
            element.classList.add('liked');
        }

        // Guardar en sessionStorage
        sessionStorage.setItem('likes', JSON.stringify(likes));
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
    if (event.target === productModal) {
        closeProductModal();
    }
    if (event.target === ordersModal) {
        closeOrdersModal();
    }
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);