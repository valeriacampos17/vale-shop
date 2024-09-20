
// Obtener el modal
var modal = document.getElementById("product-modal");

// Obtener el botón que abre el modal (puedes ajustar esto según tu implementación)
const btn = document.querySelectorAll(".cart"); // Cambia el selector según sea necesario

// Cuando el usuario hace clic en el botón, abre el modal
btn.forEach((element) => {
    // element.addEventListener("click", function () {
    //     console.log("hola");
    //     modal.style.display = "block";
    // });
});

function showModal(id) {
    const product = getProductById(id);
    const imgProduct = modal.querySelector('.img-product img');
    const productName = modal.querySelector('.info h2');
    const productPrice = modal.querySelector('.info p');
    const productSize = modal.querySelector('.info h3');
    
    imgProduct.src = product.image;
    imgProduct.alt = product.name;
    productName.textContent = product.name;
    productPrice.textContent = `$${product.price}`;
    productSize.textContent = `Talla ${product.size}`;
    
    modal.style.display = "block";
}

function getProductById(productId) {
    // Recuperar los productos de la sesión
    const products = JSON.parse(sessionStorage.getItem('productsJson'));

    if (products) {
        // Buscar el producto por ID
        const product = products.find(p => p.id === productId);

        if (product) {
            return product;
        } else {
            console.log(`Producto con ID ${productId} no encontrado.`);
            return null;
        }
    } else {
        console.log('No se encontraron productos en la sesión.');
        return null;
    }
}

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en <span> (x), cierra el modal
span.onclick = function () {
    modal.style.display = "none";
}

// Cuando el usuario hace clic en cualquier parte fuera del modal, también cierra el modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
