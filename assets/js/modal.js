var modal = document.getElementById("product-modal");

function showModal(id) {
    renderProductsModal(id);
    modal.style.display = "block";
}
function closeModal() {
    modal.style.display = "none";
}
