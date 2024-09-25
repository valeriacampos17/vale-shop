let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let likes = JSON.parse(sessionStorage.getItem('likes')) || [];

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const existingProduct = cart.find(item => item.id === productId);

    if (!existingProduct) {
        const product = getProductById(productId)
        cart.push(product);
        saveCart();
        const productIndex = likes.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            likes.splice(productIndex, 1);
            saveLikes();
            renderProductsLikes();
        }
        renderProductsOrders();
    }
    closeModal();
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);

    console.log((productIndex !== -1))
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
    }
    saveCart();
    renderProductsOrders();
}

function saveLikes() {
    sessionStorage.setItem('likes', JSON.stringify(likes));
}

function addTolikes(productId) {
    const existingProduct = likes.find(item => item.id === productId);

    if (!existingProduct) {
        const product = getProductById(productId)
        likes.push(product);
    }
    saveLikes();
    closeModal();
}

function removeFromLikes(productId) {
    const productIndex = likes.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        likes.splice(productIndex, 1);
    }
    saveLikes();
    renderProductsLikes();
}

function calculateTotal() {
    let total = 0;
    const prices = document.querySelectorAll('.item-price');

    prices.forEach(priceElement => {
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        total += price;
    });

    return total.toFixed(2);
}

function updateBuyButton() {
    const total = calculateTotal();
    const buyButton = document.getElementById('buy-button');

    buyButton.textContent = `COMPRAR $${total}`;
}




// Función para detectar si es un dispositivo móvil
function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Comprobar si el dispositivo es un móvil
    return /android|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
  }

  // Función para detectar si es una tablet
  function isTablet() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Comprobar si el dispositivo es una tablet
    return /tablet|ipad|playbook|silk/i.test(userAgent);
  }

  // Función para manejar la acción de compra
  function handleBuy() {
    if (isMobile()) {
      // Si es un móvil, podemos pedir el número manualmente o continuar sin pedir
      const phone = prompt("Por favor ingresa tu número de teléfono:");
      if (phone) {
        alert(`Gracias por tu compra. Tu número: ${phone}`);
      } else {
        alert("Compra cancelada. No se proporcionó número de teléfono.");
      }
    } else if (isTablet()) {
      // Si es una tablet, mostrar el input de número de teléfono
      document.getElementById('phone-input').style.display = 'block';
    } else {
      alert("Compra realizada desde un dispositivo no móvil.");
    }
  }

  // Manejador del botón comprar
  document.getElementById('buy-button').addEventListener('click', handleBuy);

  // Manejador para enviar el número de teléfono
  document.getElementById('submit-phone').addEventListener('click', function() {
    const phone = document.getElementById('phone').value;
    if (phone) {
      alert(`Gracias por tu compra. Tu número: ${phone}`);
      document.getElementById('phone-input').style.display = 'none'; // Ocultar el input después de ingresar el número
    } else {
      alert("Por favor, introduce un número de teléfono válido.");
    }
  });