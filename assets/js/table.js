// app.js
import { getAllProducts, updateProduct, deleteProduct } from './firebase.js';

// Función para cargar productos en la tabla
const loadProducts = async () => {
    const products = await getAllProducts();
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir los productos

    products.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.productId = product.id; // Guardar el ID del producto en la fila
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>
                <button class="btn btn-warning editBtn">Editar</button>
                <button class="btn btn-danger deleteBtn">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Inicializar DataTable con columnDefs
    $('#productsTable').DataTable({
        columnDefs: [
            { targets: [0, 4], searchable: false } // Deshabilitar búsqueda en ID y acciones
        ]
    });
};

// Abrir el modal de eliminación
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('deleteBtn')) {
        const productId = e.target.closest('tr').dataset.productId;
        document.getElementById('confirmDelete').onclick = async () => {
            await deleteProduct(productId);
            loadProducts(); // Recargar la lista de productos
            new bootstrap.Modal(document.getElementById('deleteModal')).hide(); // Cerrar el modal
        };
        new bootstrap.Modal(document.getElementById('deleteModal')).show();
    }
});

// Inicializar la página cargando los productos
loadProducts();
