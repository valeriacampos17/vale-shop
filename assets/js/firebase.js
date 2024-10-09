// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBooZYVeqEWugoLudlTLwytNaYGWxD83Wc",
    authDomain: "vale-shop.firebaseapp.com",
    databaseURL: "https://vale-shop-default-rtdb.firebaseio.com",
    projectId: "vale-shop",
    storageBucket: "vale-shop.appspot.com",
    messagingSenderId: "280352853383",
    appId: "1:280352853383:web:2d48393a1426bd8ff2d722",
    measurementId: "G-Q51W1J1918"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging  = getMessaging(app);

// Crear un nuevo producto
export const createProduct = async (product) => {
    try {
        const docRef = await addDoc(collection(db, "products"), product);
        console.log("Producto creado con ID:", docRef.id);
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
    }
};

// Leer todos los productos
export const getAllProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
    });
    return products;
};

// Actualizar un producto
export const updateProduct = async (id, updatedData) => {
    const productRef = doc(db, "products", id);
    try {
        await updateDoc(productRef, updatedData);
        console.log("Producto actualizado con ID:", id);
    } catch (e) {
        console.error("Error actualizando documento: ", e);
    }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    try {
        await deleteDoc(productRef);
        console.log("Producto eliminado con ID:", id);
    } catch (e) {
        console.error("Error eliminando documento: ", e);
    }
};

// Crear una Orden
export const createOrder = async (orders) => {
    try {
        const docRef = await addDoc(collection(db, "orders"), orders);
        console.log("Order creado con ID:", docRef.id);
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
    }
};


export const getInitToken = async () => {
    getToken(messaging, { ServiceWorkerRegistration: 'https://academys.io/vale-shop/service-worker.js', vapidKey: 'ByYo6t7WFuHF7pBLnxdP4HOFXDNe43h5SU-wXTypihQ' }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
}