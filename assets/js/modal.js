var productModal = document.getElementById("product-modal");
var ordersModal = document.getElementById("orders-modal");

function showProductModal(id) {
    renderProductsModal(id);
    productModal.style.display = "block";
}
function closeProductModal() {
    if (productModal) productModal.style.display = "none";
}

function showOrdersModal() {
    const user = sessionStorage.getItem('user');

    if (!user) {
        window.location.href = 'signin.html';
    } else {
        ordersModal.style.display = 'block';
    }
    
}

function closeOrdersModal() {
    if (ordersModal) ordersModal.style.display = 'none';
}
