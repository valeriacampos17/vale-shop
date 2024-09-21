function getAllProduct() {
  setTimeout(() => {
    fetch('assets/mock/products.json')
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('productsJson', JSON.stringify(data.products));
        const filteredProducts = data.products.slice(0, 3);
        renderProducts(filteredProducts);
      })
      .catch(error => console.error('Error al cargar productos:', error));
  }, 1500);
}

function getProductById(productId) {
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

  if (products) {
    const filteredProducts = products.filter(product => product.category_id == categoryId);
    console.log(filteredProducts)
    if (filteredProducts) {
      console.log('tiene = ', filteredProducts)
      return filteredProducts;
    } else {
      console.log(`Producto con categoryId ${categoryId} no encontrado.`);
      return null;
    }
  } else {
    console.log('No se encontraron productos en la sesión.');
    return null;
  }
}

function renderProducts(products) {
  const productContainer = document.querySelector('.product-container');
  let htmlContent = '';

  products.forEach(product => {
    htmlContent += `
      <div class="product">
        <div class="img-product">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="info-container">
          <div class="info">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
          </div>
          <div class="cart" onclick="showModal(${product.id})">
            <i class="fa-solid fa-shopping-cart"></i>
          </div>
        </div>
      </div>
    `;
  });

  productContainer.innerHTML = htmlContent;
}

function renderProductsModal(productId) {
  const productContainer = document.querySelector('#product-modal');
  let htmlContent = '';
  const product = getProductById(productId)

  htmlContent = `
    <div class="product fix-product">
      <div class="img-product">
        <img
          src="${product.image}"
          alt="${product.name}" />
      </div>
      <span class="close" onclick="closeModal()">&times;</span>
      <div class="info-container">
        <div class="info">
          <h2>${product.name}</h2>
          <p>$${product.price}</p>
          <h3>Talla ${product.size}</h3>
        </div>
        <div class="like" onclick="addTolikes(${product.id})">
          <i class="fa-solid fa-heart"></i>
        </div>
        <div class="cart" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-shopping-cart"></i>
        </div>
      </div>
    </div>
  `;

  productContainer.innerHTML = htmlContent;
}

function renderproductsGrid(products) {
  console.log(products.length)
  const productContainer = document.querySelector('.product-grid');
  let htmlContent = '';

  products.forEach(product => {
    htmlContent += `
      <div class="product-item">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-list-info">
              <h3>${product.name}</h3>
              <div class="price-cart">
                  <p>$${product.price}</p>
                  <div class="cart" onclick="showModal(${product.id})">
                      <i class="fa-solid fa-shopping-cart"></i>
                  </div>
              </div>
          </div>
      </div>
    `;
  });

  productContainer.innerHTML = htmlContent;
}

function renderProductsOrders() {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  const itemList = document.querySelector('.item-list');
  if (!itemList) return;
  itemList.innerHTML = '';
  cart.forEach(product => {
    const itemHTML = `
      <div class="item">
        <img src="${product.image}" alt="${product.name}" class="item-image" />
        <div class="item-details">
          <div class="item-name">${product.name}</div>
          <div class="item-size">Talla: ${product.size}</div>
        </div>
        <div class="item-price">$${product.price.toFixed(2)}</div>
        <button class="item-delete" aria-label="Eliminar artículo" onclick="removeFromCart(${product.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    itemList.innerHTML += itemHTML;
  });
}

function renderProductsLikes() {
  const likes = JSON.parse(sessionStorage.getItem('likes')) || [];
  const itemList = document.querySelector('.item-list-flex');
  if (!itemList) return;
  itemList.innerHTML = '';
  likes.forEach(product => {
    const itemHTML = `
      <div class="item-like">
        <img src="${product.image}" class="item-image" />
        <button aria-label="Eliminar artículo" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-shopping-cart"></i>
        </button>
      </div>
    `;
    itemList.innerHTML += itemHTML;
  });
}