// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBooZYVeqEWugoLudlTLwytNaYGWxD83Wc",
    authDomain: "vale-shop.firebaseapp.com",
    databaseURL: "https://vale-shop-default-rtdb.firebaseio.com",
    projectId: "vale-shop",
    storageBucket: "vale-shop.appspot.com",
    messagingSenderId: "280352853383",
    appId: "1:280352853383:web:2d48393a1426bd8ff2d722",
    measurementId: "G-Q51W1J1918",
    ServiceWorkerRegistration: 'https://academys.io/vale-shop/service-worker.js'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const messaging = getMessaging(app);


export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        console.error("Error en el registro de Firebase: ", error.message);
        throw error;
    }
};


export const singIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar la información del usuario en la sesión
        sessionStorage.setItem('user', JSON.stringify(user));

        return true;
    } catch (error) {
        console.error("Error en el registro de Firebase: ", error.message);
        return false;  // Retornar false si hay error en el inicio de sesión
    }
};

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

// registrar un token
export const createTokenRegistration = async (token) => {
    try {
        const docRef = await addDoc(collection(db, "tokens"), token);
        console.log("Token creado con ID:", docRef.id);
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
    }
};

// Crear un User
export const createUser = async (user) => {
    try {
        const firebaseUser = await signUp(user.email, user.password);
        user.uid = firebaseUser.uid;
        delete user.password;

        const docRef = await addDoc(collection(db, "users"), user);
        sessionStorage.setItem('user', JSON.stringify(docRef));

        window.location.href = "signin.html";
    } catch (e) {
        console.error("Error añadiendo el documento a Firestore: ", e);
    }
};

export const getInitToken = async (registration) => {

    // Solicitar permiso para mostrar notificaciones
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Permiso para notificaciones concedido.');

            // Obtener el token de FCM, y especificar el registro del Service Worker
            getToken(messaging, {
                serviceWorkerRegistration: registration,
                vapidKey: 'BO905tgtG6e5FIrh-d9bIXVZuL6cv024kw1ygHLDwrrMk55S06h7elY0YuKKpNR4egBoSabvG-OS6kbGTrfF9A0'
            }).then((currentToken) => {
                if (currentToken) {
                    console.log('Token FCM:', currentToken);
                    // Envia el token al servidor
                } else {
                    console.log('No se pudo generar un token.');
                }
            }).catch((err) => {
                console.error('Error al obtener el token:', err);
            });
        } else {
            console.error('No se otorgaron permisos para notificaciones.');
        }
    });

    // Manejar mensajes cuando la app esta en primer plano
    onMessage(messaging, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);
        // Personaliza la notificacinn
    });
}