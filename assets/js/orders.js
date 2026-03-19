let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

// Variables para el swipe
let touchStartX = 0;
let touchEndX = 0;
let currentItem = null;
let isSwiping = false;

// Variables para checkout
let currentStep = 1;
let selectedAddress = null;
let selectedPayment = null;
let addresses = [];
let currentUser = null;

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// SOBRESCRIBIR addToCart para que también actualice la vista
const originalAddToCart = window.addToCart;
window.addToCart = function (productId, selectedSize) {
    if (originalAddToCart) {
        originalAddToCart(productId, selectedSize);
    }
    // Actualizar la variable local cart
    cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    // Actualizar la vista
    renderProductsOrders();
    renderFavorites();
};

// SOBRESCRIBIR removeFromCart
const originalRemoveFromCart = window.removeFromCart;
window.removeFromCart = function (productId) {
    if (originalRemoveFromCart) {
        originalRemoveFromCart(productId);
    }
    // Actualizar la variable local cart
    cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    renderProductsOrders();
    renderFavorites();
};

// Mantener la función removeFromCart local para compatibilidad
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
    }
    saveCart();
    renderProductsOrders();
}

function saveLikes() {
    sessionStorage.setItem('likes', JSON.stringify(likes));
}

function addTolikes(productId) {
    const existingLikes = likes.some(item => item.id === productId);
    const existingProduct = cart.some(item => item.id === productId);

    if (existingProduct) {
        closeProductModal();
        return;
    }

    if (!existingLikes) {
        const product = getProductById(productId);
        if (product) {
            likes.push(product);
            saveLikes();
        }
    }
    heartDisplay();
    closeProductModal();
}

function removeFromLikes(productId) {
    const productIndex = likes.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        likes.splice(productIndex, 1);
    }
    saveLikes();
    renderFavorites();
}

function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * (item.quantity || 1);
    });
    return total.toFixed(2);
}

function updateBuyButton() {
    const total = calculateTotal();
    const buyButton = document.getElementById('buy-button');

    if (buyButton) {
        buyButton.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> COMPRAR $${total}`;
        buyButton.style.display = cart.length === 0 ? 'none' : 'flex';
    }
}

// ===== FUNCIONES PARA ASEGURAR LA ESTRUCTURA =====
function ensureSections() {
    const productList = document.querySelector('.product-list');
    const favoritesSection = document.getElementById('favorites-section');

    // Asegurar que product-list tenga su estructura
    if (productList) {
        // YA NO CREAMOS EL TÍTULO, ahora está en el HTML
        let itemList = productList.querySelector('.item-list');
        if (!itemList) {
            itemList = document.createElement('div');
            itemList.className = 'item-list';
            productList.appendChild(itemList);
        }

        let buyButton = document.getElementById('buy-button');
        if (!buyButton) {
            buyButton = document.createElement('button');
            buyButton.id = 'buy-button';
            buyButton.className = 'fix-button-buy';
            productList.appendChild(buyButton);
        }
    }

    // Asegurar que favorites-section tenga su estructura
    if (favoritesSection) {
        // YA NO CREAMOS EL TÍTULO, ahora está en el HTML
        let itemListFlex = favoritesSection.querySelector('.item-list-flex');
        if (!itemListFlex) {
            itemListFlex = document.createElement('div');
            itemListFlex.className = 'item-list-flex';
            favoritesSection.appendChild(itemListFlex);
        }
    }
}

function renderProductsOrders() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;

    const itemList = productList.querySelector('.item-list');
    if (!itemList) return;

    itemList.innerHTML = '';

    if (cart.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-cart-message';
        emptyDiv.innerHTML = `
            <i class="fa-solid fa-cart-shopping"></i>
            <p>Tu carrito está vacío</p>
            <a href="products.html" class="shop-now-btn">Ir a comprar</a>
        `;
        itemList.appendChild(emptyDiv);
    } else {
        cart.forEach((product, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'item-swipe-container';

            const deleteAction = document.createElement('div');
            deleteAction.className = 'item-delete-action';
            deleteAction.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            itemContainer.appendChild(deleteAction);

            const item = document.createElement('div');
            item.className = 'item';
            item.dataset.id = product.id;
            item.dataset.index = index;
            item.dataset.name = product.name;

            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="item-image" />
                <div class="item-details">
                    <div class="item-name">${product.name}</div>
                    <div class="item-size">Talla: ${product.selectedSize || product.size || 'M'}</div>
                </div>
                <div class="item-price">$${(product.price * (product.quantity || 1)).toFixed(2)}</div>
            `;

            itemContainer.appendChild(item);
            itemList.appendChild(itemContainer);
        });
    }

    initSwipeEvents();
    updateBuyButton();
}

function renderFavorites() {
    const favoritesSection = document.getElementById('favorites-section');
    if (!favoritesSection) return;

    const itemListFlex = favoritesSection.querySelector('.item-list-flex');
    if (!itemListFlex) return;

    itemListFlex.innerHTML = '';

    if (likes.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-favorites-message';
        emptyDiv.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            <p>No tienes favoritos aún</p>
            <a href="products.html" class="shop-now-btn">Explorar productos</a>
        `;
        itemListFlex.appendChild(emptyDiv);
    } else {
        likes.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-like';
            itemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="item-image" />
                <div class="item-like-info">
                    <div class="item-like-name">${product.name}</div>
                    <div class="item-like-price">$${product.price}</div>
                </div>
                <button onclick="addToCart(${product.id})" aria-label="Añadir al carrito" class="add-to-cart-btn">
                    <i class="fa-solid fa-cart-plus"></i> Agregar
                </button>
            `;
            itemListFlex.appendChild(itemDiv);
        });
    }
}

// ===== FUNCIONES DE SWIPE =====
function initSwipeEvents() {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.removeEventListener('touchstart', handleTouchStart);
        item.removeEventListener('touchmove', handleTouchMove);
        item.removeEventListener('touchend', handleTouchEnd);
        item.removeEventListener('mousedown', handleMouseDown);
        item.removeEventListener('mousemove', handleMouseMove);
        item.removeEventListener('mouseup', handleMouseUp);
        item.removeEventListener('mouseleave', handleMouseLeave);

        item.addEventListener('touchstart', handleTouchStart, { passive: true });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
        item.addEventListener('mousedown', handleMouseDown);
        item.addEventListener('mousemove', handleMouseMove);
        item.addEventListener('mouseup', handleMouseUp);
        item.addEventListener('mouseleave', handleMouseLeave);
    });
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    currentItem = e.currentTarget;
    isSwiping = true;
    currentItem.style.transition = 'none';
}

function handleTouchMove(e) {
    if (!isSwiping || !currentItem) return;
    touchEndX = e.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX < 0) {
        e.preventDefault();
        const translateX = Math.max(deltaX, -80);
        currentItem.style.transform = `translateX(${translateX}px)`;

        const deleteAction = currentItem.closest('.item-swipe-container').querySelector('.item-delete-action');
        if (deleteAction) {
            deleteAction.style.opacity = Math.min(Math.abs(deltaX) / 80, 1);
        }
    }
}

function handleTouchEnd(e) {
    if (!isSwiping || !currentItem) return;
    const deltaX = touchEndX - touchStartX;

    if (deltaX < -50) {
        const productId = parseInt(currentItem.dataset.id);
        const productName = currentItem.dataset.name;
        removeFromCartWithAnimation(currentItem, productId, productName);
    } else {
        resetItemPosition(currentItem);
    }

    touchStartX = touchEndX = 0;
    currentItem = null;
    isSwiping = false;
}

function handleMouseDown(e) {
    touchStartX = e.clientX;
    currentItem = e.currentTarget;
    isSwiping = true;
    currentItem.style.transition = 'none';
}

function handleMouseMove(e) {
    if (!isSwiping || !currentItem) return;
    e.preventDefault();

    touchEndX = e.clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX < 0) {
        const translateX = Math.max(deltaX, -80);
        currentItem.style.transform = `translateX(${translateX}px)`;

        const deleteAction = currentItem.closest('.item-swipe-container').querySelector('.item-delete-action');
        if (deleteAction) {
            deleteAction.style.opacity = Math.min(Math.abs(deltaX) / 80, 1);
        }
    }
}

function handleMouseUp(e) {
    if (!isSwiping || !currentItem) return;
    const deltaX = touchEndX - touchStartX;

    if (deltaX < -50) {
        const productId = parseInt(currentItem.dataset.id);
        const productName = currentItem.dataset.name;
        removeFromCartWithAnimation(currentItem, productId, productName);
    } else {
        resetItemPosition(currentItem);
    }

    touchStartX = touchEndX = 0;
    currentItem = null;
    isSwiping = false;
}

function handleMouseLeave(e) {
    if (isSwiping && currentItem) {
        resetItemPosition(currentItem);
        touchStartX = touchEndX = 0;
        currentItem = null;
        isSwiping = false;
    }
}

function resetItemPosition(item) {
    item.style.transition = 'transform 0.3s ease';
    item.style.transform = 'translateX(0)';

    const deleteAction = item.closest('.item-swipe-container').querySelector('.item-delete-action');
    if (deleteAction) deleteAction.style.opacity = '0';

    setTimeout(() => {
        if (item) item.style.transition = '';
    }, 300);
}

function removeFromCartWithAnimation(item, productId, productName) {
    item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    item.style.transform = 'translateX(-100%)';
    item.style.opacity = '0';

    setTimeout(() => {
        removeFromCart(productId);
        showDeleteNotification(productName);
        renderFavorites();
    }, 300);
}

function showDeleteNotification(productName) {
    document.querySelectorAll('.delete-notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'delete-notification';
    notification.innerHTML = `<i class="fa-solid fa-trash-can"></i><span>${productName} eliminado del carrito</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== FUNCIONES DE CHECKOUT =====
function loadUserData() {
    const userData = sessionStorage.getItem('user');
    if (userData) {
        try { currentUser = JSON.parse(userData); }
        catch (e) { console.error('Error parsing user data:', e); }
    }
}

function loadAddresses() {
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
        addresses = JSON.parse(savedAddresses);
        if (addresses.length > 0 && !selectedAddress) selectedAddress = addresses[0];
    } else {
        addresses = [
            { id: '1', name: 'Juan Campos', address: 'Av. Principal 123', city: 'Caracas', state: 'Distrito Capital', zipCode: '1010', isDefault: true },
            { id: '2', name: 'Abuela', address: 'urb. Coromoto', city: 'Coro', state: 'Falcón', zipCode: '2121', isDefault: false },
            { id: '3', name: 'oficina', address: 'calle paez', city: 'La Victoria', state: 'Aragua', zipCode: '2121', isDefault: false }
        ];
        selectedAddress = addresses[0];
        saveAddresses();
    }
}

function saveAddresses() {
    localStorage.setItem('addresses', JSON.stringify(addresses));
}

function saveAddress(e) {
    e.preventDefault();
    const form = document.getElementById('address-form');
    const newAddress = {
        id: Date.now().toString(),
        name: form.fullname.value,
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        zipCode: form.zipcode.value,
        isDefault: addresses.length === 0
    };

    addresses.push(newAddress);
    if (!selectedAddress) selectedAddress = newAddress;
    saveAddresses();
    closeAddressModal();
    renderCheckout();
}

function closeAddressModal() {
    const modal = document.getElementById('address-modal');
    if (modal) modal.style.display = 'none';
}

function showAddressModal() {
    const modal = document.getElementById('address-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('address-form').reset();
    }
}

function selectAddress(addressId) {
    selectedAddress = addresses.find(a => a.id === addressId);
    renderCheckout();
}

function editAddress(addressId) {
    showNotification('Función de edición próximamente', '#79b1b7');
}

function selectPayment(paymentId) {
    selectedPayment = paymentId;
    localStorage.setItem('selectedPayment', paymentId);
    renderCheckout();
}

function getPaymentMethodName(paymentId) {
    const methods = { 'pago-movil': 'Pago Móvil / Transferencia', 'usdt': 'USDT Binance' };
    return methods[paymentId] || paymentId;
}

function nextStep() { if (currentStep < 3) { currentStep++; renderCheckout(); } }
function prevStep() { if (currentStep > 1) { currentStep--; renderCheckout(); } }
function goToStep(step) { if (step >= 1 && step <= 3) { currentStep = step; renderCheckout(); } }

function renderCheckout() {
    const progressContainer = document.getElementById('checkout-progress');
    const container = document.getElementById('checkout-container');
    const actionsContainer = document.getElementById('checkout-actions');

    if (!progressContainer || !container || !actionsContainer) return;

    progressContainer.innerHTML = `
        <div class="progress-step ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}">1</div>
        <div class="progress-step ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}">2</div>
        <div class="progress-step ${currentStep >= 3 ? 'active' : ''}">3</div>
    `;

    let contentHtml = currentStep > 1 ? `<button onclick="prevStep()" class="back-button"><i class="fa-solid fa-chevron-left"></i> Volver</button>` : '';
    let actionsHtml = '';

    switch (currentStep) {
        case 1:
            contentHtml += renderAddressStep();
            actionsHtml = `<button onclick="nextStep()" class="fix-button-buy" ${!selectedAddress ? 'disabled' : ''}><i class="fa-solid fa-arrow-right"></i> Continuar</button>`;
            break;
        case 2:
            contentHtml += renderPaymentStep();
            actionsHtml = `<button onclick="nextStep()" class="fix-button-buy" ${!selectedPayment ? 'disabled' : ''}><i class="fa-solid fa-arrow-right"></i> Continuar</button>`;
            break;
        case 3:
            contentHtml += renderReviewStep();
            actionsHtml = `<button onclick="completePurchase()" class="fix-button-buy"><i class="fa-solid fa-lock"></i> Compra y Pagar</button>`;
            break;
    }

    container.innerHTML = contentHtml;
    actionsContainer.innerHTML = actionsHtml;
}

function renderAddressStep() {
    let html = '<h2 class="section-title">Dirección de Envío</h2>';

    addresses.forEach(address => {
        const isSelected = selectedAddress && selectedAddress.id === address.id;
        html += `
            <div class="address-card ${isSelected ? 'selected' : ''}" onclick="selectAddress('${address.id}')">
                <h3>${address.name}<button class="edit-address-btn" onclick="editAddress('${address.id}'); event.stopPropagation();"><i class="fa-solid fa-pencil"></i> Editar</button></h3>
                <p>${address.address}</p>
                <p>${address.city}, ${address.state} ${address.zipCode}</p>
            </div>
        `;
    });

    html += `<button onclick="showAddressModal()" class="add-address-btn"><i class="fa-solid fa-plus"></i> Añadir Nueva Dirección</button>`;
    return html;
}

function renderPaymentStep() {
    const paymentMethods = [
        { id: 'pago-movil', name: 'Pago Móvil / Transferencia', icon: 'fa-solid fa-mobile-screen', description: 'Pago inmediato' },
        { id: 'tarjeta', name: 'Tarjeta de Crédito / Débito', icon: 'fa-solid fa-credit-card', description: 'Próximamente', disabled: true },
        { id: 'usdt', name: 'USDT Binance', icon: 'fa-brands fa-bitcoin', description: 'Criptomonedas' }
    ];

    let html = '<h2 class="section-title">Método de Pago</h2>';

    paymentMethods.forEach(method => {
        const isSelected = selectedPayment === method.id;
        html += `
            <div class="payment-option ${isSelected ? 'selected' : ''} ${method.disabled ? 'disabled' : ''}" 
                 onclick="${!method.disabled ? `selectPayment('${method.id}')` : ''}">
                <input type="radio" name="payment" value="${method.id}" ${isSelected ? 'checked' : ''} ${method.disabled ? 'disabled' : ''} onchange="selectPayment('${method.id}')">
                <div class="payment-icon"><i class="${method.icon}"></i></div>
                <div class="payment-info"><h3>${method.name}</h3><p>${method.description}</p></div>
            </div>
        `;
    });

    return html;
}

function renderReviewStep() {
    cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) return '<p style="text-align: center; color: #666;">No hay productos en el carrito</p>';

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const iva = subtotal * 0.16;
    const envio = 5.00;
    const total = subtotal + iva + envio;

    let html = '<h2 class="section-title">Revisión de tu Pedido</h2>';

    cart.forEach(item => {
        html += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${item.price.toFixed(2)}</div>
                    <div class="order-item-quantity">Cantidad: ${item.quantity || 1}</div>
                </div>
            </div>
        `;
    });

    html += `
        <div class="order-total">
            <div class="total-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="total-row"><span>IVA (16%):</span><span>$${iva.toFixed(2)}</span></div>
            <div class="total-row"><span>Envío:</span><span>$${envio.toFixed(2)}</span></div>
            <div class="total-row final"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
        </div>

        <div class="delivery-info">
            <h3><i class="fa-solid fa-truck"></i> Enviar a:</h3>
            ${selectedAddress ? `<p><strong>${selectedAddress.name}</strong></p><p>${selectedAddress.address}</p><p>${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}</p>` : '<p>No hay dirección seleccionada</p>'}
            
            <h3 style="margin-top: 16px;"><i class="fa-solid fa-credit-card"></i> Pagar con:</h3>
            <p>${getPaymentMethodName(selectedPayment)}</p>
            
            <a href="#" onclick="goToStep(1); return false;" class="modify-details"><i class="fa-solid fa-pencil"></i> Modificar detalles</a>
        </div>
    `;

    return html;
}

async function completePurchase() {
    cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    if (cart.length === 0) { showNotification('El carrito está vacío', '#ff4444'); return; }
    if (!selectedAddress) { showNotification('Debes seleccionar una dirección', '#ff4444'); goToStep(1); return; }
    if (!selectedPayment) { showNotification('Debes seleccionar un método de pago', '#ff4444'); goToStep(2); return; }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const orderData = {
        userId: currentUser?.uid || 'guest',
        userEmail: currentUser?.email || 'guest@email.com',
        userName: currentUser?.nombre || 'Usuario',
        items: cart,
        address: selectedAddress,
        payment: selectedPayment,
        subtotal: subtotal,
        iva: subtotal * 0.16,
        envio: 5.00,
        total: subtotal * 1.16 + 5,
        date: new Date().toISOString(),
        status: 'pendiente'
    };

    try {
        const { createOrder } = await import('./firebase.js');
        await createOrder(orderData);
        clearCart();
        closeOrdersModal();
        showSuccessNotification();
        currentStep = 1; selectedAddress = null; selectedPayment = null;
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        showNotification('Error al procesar la compra', '#ff4444');
    }
}

function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = '<i class="fa-solid fa-check-circle"></i><span>¡Pedido realizado con éxito!</span>';
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'fadeOut 0.3s ease'; setTimeout(() => notification.remove(), 300); }, 2000);
}

function showNotification(message, bgColor = '#79b1b7') {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="fa-solid fa-info-circle"></i><span>${message}</span>`;
    notification.style.backgroundColor = bgColor;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'fadeOut 0.3s ease'; setTimeout(() => notification.remove(), 300); }, 2000);
}

function clearCart() {
    cart = [];
    sessionStorage.removeItem('cart');
    renderProductsOrders();
    renderFavorites();
}

function isUserLoggedIn() {
    const userInfo = JSON.parse(sessionStorage.getItem('user') || '{}');
    return userInfo && Object.keys(userInfo).length > 0 && userInfo.uid;
}

function showCheckoutModal() {
    loadUserData();
    loadAddresses();
    currentStep = 1;
    renderCheckout();
    const modal = document.getElementById('orders-modal');
    if (modal) modal.style.display = 'flex';
}

function showOrdersModal() {
    if (!isUserLoggedIn()) {
        sessionStorage.setItem('redirectAfterLogin', 'checkout');
        window.location.href = 'signin.html';
        return;
    }
    showCheckoutModal();
}

function closeOrdersModal() {
    const modal = document.getElementById('orders-modal');
    if (modal) modal.style.display = 'none';
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    // Primero asegurar la estructura
    ensureSections();

    // Luego renderizar el contenido
    renderProductsOrders();
    renderFavorites();

    const buyButton = document.getElementById("buy-button");
    if (buyButton) buyButton.addEventListener('click', showOrdersModal);

    const redirectToCheckout = sessionStorage.getItem('redirectAfterLogin');
    if (redirectToCheckout === 'checkout' && isUserLoggedIn()) {
        sessionStorage.removeItem('redirectAfterLogin');
        setTimeout(() => {
            showCheckoutModal();
        }, 100);
    }

    Object.assign(window, {
        addToCart, closeOrdersModal, selectAddress, selectPayment,
        nextStep, prevStep, goToStep, showAddressModal,
        closeAddressModal, saveAddress, editAddress, completePurchase,
        showCheckoutModal, removeFromLikes, addTolikes
    });
});

var btnSubmit = document.getElementById("btn-submit");
if (btnSubmit) btnSubmit.addEventListener('click', sendEmail);

function sendEmail() { console.log('Enviando email...'); }