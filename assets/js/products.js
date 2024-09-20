function getAllProduct() {
    fetch('assets/mock/products.json')
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('productsJson', JSON.stringify(data.products));
        const filteredProducts = data.products.slice(0, 3);
        renderProducts(filteredProducts);
      })
      .catch(error => console.error('Error al cargar productos:', error));
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

function getProductByCategoryId(categoryId) {
    const products = JSON.parse(sessionStorage.getItem('productsJson'));

    console.log(products)

    if (products) {
        // Buscar el producto por categoryId
        const filteredProducts  = products.filter(product => product.category_id === categoryId);

        if (filteredProducts ) {
            return filteredProducts ;
        } else {
            console.log(`Producto con categoryId ${categoryId} no encontrado.`);
            return null;
        }
    } else {
        console.log('No se encontraron productos en la sesión.');
        return null;
    }
}