let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const existingProduct = cart.find(item => item.id === productId);

    if (!existingProduct) {
        const product = getProductById(productId)
        cart.push(product);
        saveCart();
        const productIndex = likes.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            likes.splice(productIndex, 1);
            saveLikes();
            renderProductsLikes();
        }
        renderProductsOrders();
    }
    closeModal();
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

function addTolikes(productId) {
    const existingProduct = likes.find(item => item.id === productId);

    if (!existingProduct) {
        const product = getProductById(productId)
        likes.push(product);
    }
    saveLikes();
    closeModal();
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
