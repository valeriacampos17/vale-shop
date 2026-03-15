let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

// Variables para el swipe
let touchStartX = 0;
let touchEndX = 0;
let currentItem = null;
let isSwiping = false;

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = getProductById(productId);
    const existingProduct = cart.find(item => item.id === productId);
    const existingLikesIndex = likes.findIndex(item => item.id === productId);

    if (!existingProduct && product) {
        cart.push(product);
        saveCart();
    }

    if (existingLikesIndex !== -1) {
        likes.splice(existingLikesIndex, 1);
        saveLikes();
        renderFavorites();
    }

    if (!existingProduct || existingLikesIndex !== -1) {
        renderProductsOrders();
    }

    closeProductModal();
}

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
    }
}

function renderProductsOrders() {
    const itemList = document.querySelector('.item-list');
    if (!itemList) return;

    itemList.innerHTML = '';

    cart.forEach((product, index) => {
        const itemHTML = `
            <div class="item-swipe-container">
                <div class="item-delete-action">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
                <div class="item" data-id="${product.id}" data-index="${index}" data-name="${product.name}">
                    <img src="${product.image}" alt="${product.name}" class="item-image" />
                    <div class="item-details">
                        <div class="item-name">${product.name}</div>
                        <div class="item-size">Talla: ${product.selectedSize || product.size || 'M'}</div>
                    </div>
                    <div class="item-price">$${(product.price * (product.quantity || 1)).toFixed(2)}</div>
                </div>
            </div>
        `;
        itemList.innerHTML += itemHTML;
    });

    // Inicializar eventos de swipe
    initSwipeEvents();
    updateBuyButton();
}

function renderFavorites() {
    const itemList = document.querySelector('.item-list-flex');
    if (!itemList) return;

    itemList.innerHTML = '';

    likes.forEach(product => {
        const itemHTML = `
            <div class="item-like">
                <img src="${product.image}" alt="${product.name}" class="item-image" />
                <div class="item-like-info">
                    <div class="item-like-name">${product.name}</div>
                    <div class="item-like-price">$${product.price}</div>
                </div>
                <button onclick="addToCart(${product.id})" aria-label="Añadir al carrito">
                    <i class="fa-solid fa-cart-plus"></i> Agregar
                </button>
            </div>
        `;
        itemList.innerHTML += itemHTML;
    });
}

// Funciones de swipe
function initSwipeEvents() {
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        // Eventos táctiles
        item.addEventListener('touchstart', handleTouchStart, { passive: true });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);

        // Eventos de mouse (para escritorio)
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

    // Solo permitir deslizar hacia la izquierda (valores negativos)
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

    touchStartX = 0;
    touchEndX = 0;
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

    touchStartX = 0;
    touchEndX = 0;
    currentItem = null;
    isSwiping = false;
}

function handleMouseLeave(e) {
    if (isSwiping && currentItem) {
        resetItemPosition(currentItem);
        touchStartX = 0;
        touchEndX = 0;
        currentItem = null;
        isSwiping = false;
    }
}

function resetItemPosition(item) {
    item.style.transition = 'transform 0.3s ease';
    item.style.transform = 'translateX(0)';

    const deleteAction = item.closest('.item-swipe-container').querySelector('.item-delete-action');
    if (deleteAction) {
        deleteAction.style.opacity = '0';
    }

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
    const existingNotifications = document.querySelectorAll('.delete-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'delete-notification';
    notification.innerHTML = `
        <i class="fa-solid fa-trash-can"></i>
        <span>${productName} eliminado del carrito</span>
    `;

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

// Event listeners
var buyButton = document.getElementById("buy-button");
if (buyButton) {
    buyButton.addEventListener('click', showOrdersModal);
}

var btnSubmit = document.getElementById("btn-submit");
if (btnSubmit) {
    btnSubmit.addEventListener('click', sendEmail);
}

function sendEmail() {
    // Implementar lógica de envío de email
    console.log('Enviando email...');
}