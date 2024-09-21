let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    console.log(product)
    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        // Si ya está en el carrito, incrementar la cantidad
        existingProduct.quantity += 1;
    } else {
        // Si no está en el carrito, agregarlo
        cart.push({ ...product, quantity: 1 });
    }

    // Guardar el carrito actualizado en sessionStorage
    saveCart();

    // Actualizar la vista del carrito
    updateCartView();
}

function removeFromCart(productId) {
    // Buscar el producto en el carrito por su id
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        const product = cart[productIndex];

        if (product.quantity > 1) {
            // Si la cantidad es mayor que 1, disminuir la cantidad
            product.quantity -= 1;
        } else {
            // Si la cantidad es 1, quitar el producto del carrito
            cart.splice(productIndex, 1);
        }
    }

    // Guardar el carrito actualizado en sessionStorage
    saveCart();

    // Actualizar la vista del carrito
    updateCartView();
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartView();  // Actualizar la vista del carrito al cargar la página
});
