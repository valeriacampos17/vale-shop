function getAllProduct() {
  // El skeleton ya está visible en el HTML
  setTimeout(() => {
    fetch('assets/mock/products.json')
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('productsJson', JSON.stringify(data.products));
        const filteredProducts = data.products.slice(0, 3);
        renderProducts(filteredProducts);
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        // Mostrar mensaje de error en el carrusel
        showErrorInCarousel();
      });
  }, 1500); // Mantener el skeleton visible por 1.5 segundos
}

function showErrorInCarousel() {
  const productContainer = document.querySelector('.product-container');
  if (!productContainer) return;

  productContainer.innerHTML = `
    <div class="product error">
      <div class="img-product" style="background: #ffebee; display: flex; align-items: center; justify-content: center;">
        <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; color: #c62828;"></i>
      </div>
      <div class="info-container">
        <div class="info">
          <h2>Error al cargar</h2>
          <p>Intenta nuevamente</p>
        </div>
      </div>
    </div>
  `;
}

function getProductById(productId) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));

  if (products) {
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
  if (!productContainer) return;

  let htmlContent = '';

  products.forEach(product => {
    htmlContent += `
      <div class="product" onclick="showProductModal(${product.id})">
        <div class="img-product">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="info-container">
          <div class="info">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
          </div>
          <div class="cart">
            <i class="fa-solid fa-shopping-cart"></i>
          </div>
        </div>
      </div>
    `;
  });

  productContainer.innerHTML = htmlContent;

  // Resetear el índice del carrusel después de renderizar
  if (typeof slideIndex !== 'undefined') {
    slideIndex = 0;
  }
}

function renderProductsModal(productId) {
  const modalContent = document.querySelector('#product-modal .modal-content');
  if (!modalContent) return;

  const product = getProductById(productId);
  if (!product) return;

  // Verificar si el producto ya está en likes
  const likes = JSON.parse(sessionStorage.getItem('likes')) || [];
  const isLiked = likes.some(p => p.id === product.id);

  // Generar opciones de talla
  const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const defaultSize = product.size || 'M';

  let sizesHTML = '';
  sizes.forEach(size => {
    sizesHTML += `<div class="size-option ${size === defaultSize ? 'selected' : ''}" onclick="selectSize(this, '${size}')">${size}</div>`;
  });

  const htmlContent = `
    <div class="product fix-product">
      <div class="img-product">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <span class="close" onclick="closeProductModal()">
        <i class="fa-solid fa-xmark"></i>
      </span>
      <div class="info-container">
        <div class="info">
          <h2>${product.name}</h2>
          <p class="product-description">${product.description || 'Camisa Polo De Manga Corta Con Cuello'}</p>
          
          <div class="size-selector">
            <h3>Select size</h3>
            <div class="size-options">
              ${sizesHTML}
            </div>
          </div>

          <div class="price-row">
            <span class="price">$${product.price}</span>
            <div class="button-group">
              <button class="add-button" onclick="addToCartFromModal(${product.id})" title="Agregar al carrito">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button class="like-button ${isLiked ? 'liked' : ''}" onclick="toggleLikeFromModal(${product.id}, this)" title="Me gusta">
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContent.innerHTML = htmlContent;
}

function renderProductsGrid(products) {
  const productContainer = document.querySelector('.product-grid');
  let htmlContent = '';

  if (!products) return;
  products.forEach(product => {
    htmlContent += `
      <div class="product-item">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-list-info">
              <h3>${product.name}</h3>
              <div class="price-cart">
                  <p>$${product.price}</p>
                  <div class="cart" onclick="showProductModal(${product.id})">
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
          <div class="item-size">Talla: ${product.selectedSize || product.size || 'M'}</div>
        </div>
        <div class="item-price">$${(product.price * (product.quantity || 1)).toFixed(2)}</div>
        <button class="item-delete" aria-label="Eliminar artículo" onclick="removeFromCart(${product.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    itemList.innerHTML += itemHTML;
  });
  updateBuyButton();
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
        <button aria-label="Añadir al carrito" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-shopping-cart"></i>
        </button>
      </div>
    `;
    itemList.innerHTML += itemHTML;
  });
}

// ===== FUNCIONES PARA EL MODAL =====

// Variable global para la talla seleccionada
let selectedSize = 'M';

// Función para seleccionar talla
function selectSize(element, size) {
  // Remover clase selected de todas las opciones
  document.querySelectorAll('.size-option').forEach(opt => {
    opt.classList.remove('selected');
  });

  // Agregar clase selected a la opción clickeada
  element.classList.add('selected');

  // Guardar la talla seleccionada
  selectedSize = size;
  console.log('Talla seleccionada:', selectedSize);
}

// Función para agregar al carrito desde el modal
function addToCartFromModal(productId) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));
  const product = products.find(p => p.id === productId);

  if (product) {
    // Agregar la talla seleccionada al producto
    const productWithSize = {
      ...product,
      selectedSize: selectedSize,
      quantity: 1
    };

    // Obtener carrito actual
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Verificar si el producto ya existe en el carrito (mismo ID y misma talla)
    const existingProductIndex = cart.findIndex(p => p.id === productId && p.selectedSize === selectedSize);

    if (existingProductIndex >= 0) {
      // Incrementar cantidad si ya existe
      cart[existingProductIndex].quantity += 1;
    } else {
      // Agregar nuevo producto
      cart.push(productWithSize);
    }

    // Guardar en sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar contador del carrito
    updateCartCounter();

    // Mostrar confirmación
    showAddToCartNotification(product.name);
  }
}

// Función para toggle like desde el modal
function toggleLikeFromModal(productId, buttonElement) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));
  const product = products.find(p => p.id === productId);

  if (product) {
    let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

    // Verificar si ya existe
    const existingIndex = likes.findIndex(p => p.id === productId);

    if (existingIndex >= 0) {
      // Quitar de likes
      likes.splice(existingIndex, 1);
      buttonElement.classList.remove('liked');

      // Mostrar notificación de quitado
      showLikeNotification(product.name, 'removed');
    } else {
      // Agregar a likes
      likes.push(product);
      buttonElement.classList.add('liked');

      // Mostrar notificación de agregado
      showLikeNotification(product.name, 'added');
    }

    sessionStorage.setItem('likes', JSON.stringify(likes));

    // Actualizar la vista de likes si estamos en la página de likes
    if (window.location.pathname.includes('orders.html')) {
      renderProductsLikes();
    }
  }
}

// Función para mostrar notificación de like
function showLikeNotification(productName, action) {
  // Eliminar notificaciones existentes
  const existingNotifications = document.querySelectorAll('.cart-notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  const message = action === 'added' ? 'agregado a favoritos' : 'eliminado de favoritos';

  notification.innerHTML = `
    <i class="fa-solid fa-${action === 'added' ? 'heart' : 'heart-circle-xmark'}"></i>
    <span>${productName} ${message}</span>
  `;

  // Estilos para la notificación
  notification.style.position = 'fixed';
  notification.style.bottom = '80px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = action === 'added' ? '#ff4444' : '#999';
  notification.style.color = 'white';
  notification.style.padding = '12px 24px';
  notification.style.borderRadius = '30px';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  notification.style.zIndex = '3000';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '10px';
  notification.style.animation = 'slideUp 0.3s ease';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

// Función para actualizar contador del carrito
function updateCartCounter() {
  // Buscar si existe un elemento para el contador (puedes agregarlo en el header si lo deseas)
  const cartCounter = document.getElementById('cart-counter');
  if (cartCounter) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Función para actualizar el botón de compra (si existe)
function updateBuyButton() {
  const buyButton = document.querySelector('.buy-button');
  if (buyButton) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    buyButton.style.display = cart.length > 0 ? 'block' : 'none';
  }
}

// Función para eliminar del carrito
function removeFromCart(productId) {
  let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  cart = cart.filter(p => p.id !== productId);
  sessionStorage.setItem('cart', JSON.stringify(cart));
  renderProductsOrders();
  updateCartCounter();
}

// Función para agregar al carrito (versión simple)
function addToCart(productId) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));
  const product = products.find(p => p.id === productId);

  if (product) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Verificar si el producto ya existe
    const existingProduct = cart.find(p => p.id === productId);

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        selectedSize: product.size || 'M'
      });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();

    // Mostrar notificación
    showAddToCartNotification(product.name);
  }
}

// Función para agregar a likes (versión simple)
function addTolikes(productId) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));
  const product = products.find(p => p.id === productId);

  if (product) {
    let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

    // Verificar si ya existe
    const existingIndex = likes.findIndex(p => p.id === productId);

    if (existingIndex >= 0) {
      likes.splice(existingIndex, 1);
    } else {
      likes.push(product);
    }

    sessionStorage.setItem('likes', JSON.stringify(likes));

    // Actualizar la vista de likes si estamos en la página de likes
    if (window.location.pathname.includes('orders.html')) {
      renderProductsLikes();
    }
  }
}

// Función para mostrar notificación de agregado al carrito
function showAddToCartNotification(productName) {
  // Eliminar notificaciones existentes
  const existingNotifications = document.querySelectorAll('.cart-notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <i class="fa-solid fa-check-circle"></i>
    <span>${productName} agregado al carrito</span>
  `;

  // Estilos para la notificación
  notification.style.position = 'fixed';
  notification.style.bottom = '80px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = '#79b1b7';
  notification.style.color = 'white';
  notification.style.padding = '12px 24px';
  notification.style.borderRadius = '30px';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  notification.style.zIndex = '3000';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '10px';
  notification.style.animation = 'slideUp 0.3s ease';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 2000);
}