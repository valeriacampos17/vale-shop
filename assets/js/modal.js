var productModal = document.getElementById("product-modal");
var ordersModal = document.getElementById("orders-modal");

function showProductModal(id) {
    renderProductsModal(id);
    productModal.style.display = "block";
}
function closeProductModal() {
    productModal.style.display = "none";
}

function showOrdersModal() {
    console.log('showOrdersModal >>> ')
    ordersModal.style.display = 'block';
}

function closeOrdersModal() {
    ordersModal.style.display = 'none';
}
