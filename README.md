# Vale-Shop PWA

Vale-Shop es una Progressive Web App (PWA) diseñada para mostrar una variedad de productos de manera interactiva. Con una interfaz amigable y moderna, esta aplicación permite a los usuarios navegar por diferentes categorías de productos y explorar un carrusel de artículos destacados.

## Características

- **Carrusel de Productos:** En la página principal, puedes ver un carrusel que muestra productos destacados, con botones para navegar entre ellos.
- **Categorías de Productos:** Acceso rápido a diferentes categorías de productos, incluyendo Ropa de Mujer, Ropa de Hombre y Accesorios.
- **Modo Oscuro/Claro:** Cambia el tema de la aplicación con un simple clic.
- **Soporte para PWA:** Instalación en dispositivos móviles y acceso sin conexión gracias al uso de Service Workers.

## Instalación

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/tu-usuario/vale-shop.git
   ```
2. Navega a la carpeta del proyecto:
   ```bash
   cd vale-shop
   ```
3. Abre el archivo `index.html` en tu navegador.

## Estructura del Proyecto

- **`index.html`**: Página principal con el carrusel y las categorías.
- **`products.html`**: Página que lista todos los productos por categoría (en desarrollo).
- **`manifest.json`**: Archivo de configuración para la PWA.
- **`assets/`**: Contiene todos los archivos CSS, JavaScript e imágenes.
- **`service-worker.js`**: Archivo que permite la funcionalidad offline de la PWA.

## Uso

1. Abre la aplicación en un navegador compatible (Chrome, Firefox, etc.).
2. Explora los productos destacados en el carrusel.
3. Haz clic en las categorías para ver más productos.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar la aplicación, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama para tu función:
   ```bash
   git checkout -b feature/nueva-funcion
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Agrega nueva función"
   ```
4. Envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo y modificarlo como desees.

---

Para más información y actualizaciones, consulta la [documentación de PWA](https://web.dev/progressive-web-apps/). ¡Disfruta de tu experiencia de compra en Vale-Shop!