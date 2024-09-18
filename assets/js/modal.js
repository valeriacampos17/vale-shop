
// Obtener el modal
var modal = document.getElementById("product-modal");

// Obtener el botón que abre el modal (puedes ajustar esto según tu implementación)
const btn = document.querySelectorAll(".cart"); // Cambia el selector según sea necesario

// Cuando el usuario hace clic en el botón, abre el modal
btn.forEach((element) => {
    element.addEventListener("click", function () {
        console.log("hola");
        modal.style.display = "block";
    });
});

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
