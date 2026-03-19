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
        showErrorInCarousel();
      });
  }, 1500);
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
    return products.find(p => p.id === productId) || null;
  }
  return null;
}

function getProductByCategoryId(categoryId) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));
  if (products) {
    return products.filter(product => product.category_id == categoryId);
  }
  return null;
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
  if (!productContainer || !products) return;

  let htmlContent = '';
  products.forEach(product => {
    htmlContent += `
            <div class="product-item" onclick="showProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-list-info">
                    <h3>${product.name}</h3>
                    <div class="price-cart">
                        <p>$${product.price}</p>
                        <div class="cart">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  productContainer.innerHTML = htmlContent;
}

// ELIMINAR renderProductsOrders y renderProductsLikes - ya no se necesitan aquí

// ===== FUNCIONES PARA EL MODAL =====

// Variable global para la talla seleccionada
let selectedSize = 'M';

function selectSize(element, size) {
  document.querySelectorAll('.size-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  element.classList.add('selected');
  selectedSize = size;
}

function toggleLikeFromModal(productId, buttonElement) {
  const products = JSON.parse(sessionStorage.getItem('productsJson'));
  const product = products.find(p => p.id === productId);

  if (product) {
    let likes = JSON.parse(sessionStorage.getItem('likes')) || [];
    const existingIndex = likes.findIndex(p => p.id === productId);

    if (existingIndex >= 0) {
      likes.splice(existingIndex, 1);
      buttonElement.classList.remove('liked');
      showLikeNotification(product.name, 'removed');
    } else {
      likes.push(product);
      buttonElement.classList.add('liked');
      showLikeNotification(product.name, 'added');
    }

    sessionStorage.setItem('likes', JSON.stringify(likes));
  }
}

function showLikeNotification(productName, action) {
  document.querySelectorAll('.cart-notification').forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  const message = action === 'added' ? 'agregado a favoritos' : 'eliminado de favoritos';

  notification.innerHTML = `
        <i class="fa-solid fa-${action === 'added' ? 'heart' : 'heart-circle-xmark'}"></i>
        <span>${productName} ${message}</span>
    `;

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

// Hacer funciones globales necesarias
window.getProductById = getProductById;
window.showProductModal = showProductModal;
window.selectSize = selectSize;
window.toggleLikeFromModal = toggleLikeFromModal;