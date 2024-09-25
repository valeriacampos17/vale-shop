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
    ordersModal.style.display = 'block';
}

function closeOrdersModal() {
    if (ordersModal) ordersModal.style.display = 'none';
}
