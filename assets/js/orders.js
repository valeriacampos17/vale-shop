let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

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
        renderProductsLikes();
    }

    if (!existingProduct || existingLikesIndex !== -1) {
        renderProductsOrders();
    }

    closeProductModal();
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);

    console.log((productIndex !== -1))
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
    }
    saveCart();
    renderProductsOrders();
}

function saveLikes() {
    sessionStorage.setItem('likes', JSON.stringify(likes));
}

function addTolikes (productId) {
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
    renderProductsLikes();
}

function calculateTotal() {
    let total = 0;
    const prices = document.querySelectorAll('.item-price');

    prices.forEach(priceElement => {
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        total += price;
    });

    return total.toFixed(2);
}

function updateBuyButton() {
    const total = calculateTotal();
    const buyButton = document.getElementById('buy-button');

    buyButton.textContent = `COMPRAR $${total}`;
}

var buyButton = document.getElementById("buy-button");

if (buyButton) {
    buyButton.addEventListener('click', showOrdersModal);
}

var btnSubmit = document.getElementById("btn-submit");

if (btnSubmit) {
    buyButton.addEventListener('click', sendEmail);
}

function sendEmail() {



}
