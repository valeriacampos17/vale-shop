const heartsContainer = document.getElementById('hearts-container');
const heartButton = document.getElementById('heart-button');

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    const size = Math.random() * 40 + 10 + 'px';
    heart.style.width = size;
    heart.style.height = size;

    // Coloca el corazón en la posición del botón
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000); // Elimina el corazón después de 5 segundos
}

// heartButton.addEventListener('click', (event) => {
    
// });

function heartDisplay() {
    const buttonRect = heartButton.getBoundingClientRect();
    const x = buttonRect.left + buttonRect.width / 2;
    const y = buttonRect.top;

    const numberOfHearts = Math.floor(Math.random() * 3) + 10; // Genera entre 10 y 12 corazones

    for (let i = 0; i < numberOfHearts; i++) {
        setTimeout(() => createHeart(x, y), i * 300); // Genera un corazón cada 300ms
    }
}