// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  initializeFirestore,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import {
  getToken,
  onMessage,
  getMessaging,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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
  ServiceWorkerRegistration: "https://academys.io/vale-shop/service-worker.js",
};

export { db };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Esto soluciona el error de CORS en localhost
});
// const messaging = getMessaging(app);

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error en el registro de Firebase: ", error.message);
    throw error;
  }
};

// Función para obtener datos completos del usuario desde Firestore
export const getUserData = async (uid) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = { id: doc.id, ...doc.data() };
    });

    return userData;
  } catch (e) {
    console.error("Error obteniendo datos del usuario: ", e);
    return null;
  }
};

// Función para crear un perfil de usuario en Firestore si no existe
export const ensureUserProfile = async (user) => {
  try {
    const userData = await getUserData(user.uid);

    // Si no existe perfil, crear uno básico
    if (!userData) {
      const newUserProfile = {
        uid: user.uid,
        email: user.email,
        nombre: "",
        telefono: "",
        fechaRegistro: new Date().toISOString(),
        emailVerified: user.emailVerified,
      };

      const docRef = await addDoc(collection(db, "users"), newUserProfile);
      console.log("Perfil de usuario creado automáticamente:", docRef.id);
      return newUserProfile;
    }

    return userData;
  } catch (e) {
    console.error("Error asegurando perfil de usuario:", e);
    return null;
  }
};

// Función signIn corregida
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Asegurar que existe el perfil en Firestore
    const userData = await ensureUserProfile(user);

    // Guardar SOLO la información necesaria en una sola clave
    const userSession = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      nombre: userData?.nombre || "",
      telefono: userData?.telefono || "",
      fechaRegistro: userData?.fechaRegistro || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    sessionStorage.setItem("user", JSON.stringify(userSession));

    return true;
  } catch (error) {
    console.error("Error en el inicio de sesión: ", error.message);
    return false;
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

// Crear un Usuario (Registro) - VERSIÓN MEJORADA
export const createUser = async (userData) => {
  try {
    // Validar que tenga email (OBLIGATORIO para Firebase Auth)
    if (!userData.email) {
      console.error("Error: Email es requerido para Firebase Auth");
      return {
        success: false,
        error: "EMAIL_REQUIRED",
        message: "El correo electrónico es obligatorio para el registro",
      };
    }

    // 1. Crear usuario en Firebase Auth
    console.log("Creando usuario en Auth:", userData.email);
    const firebaseUser = await signUp(userData.email, userData.password);
    console.log("Usuario creado en Auth:", firebaseUser.uid);

    // 2. Preparar datos para Firestore
    const firestoreUser = {
      uid: firebaseUser.uid,
      email: userData.email,
      nombre: userData.name || userData.nombre || "",
      telefono: userData.phone || userData.telefono || "",
      fechaRegistro: new Date().toISOString(),
      emailVerified: firebaseUser.emailVerified || false,
    };

    // 3. Guardar en Firestore con manejo de error específico
    try {
      console.log("Guardando en Firestore:", firestoreUser);
      const docRef = await addDoc(collection(db, "users"), firestoreUser);
      console.log("✅ Usuario guardado en Firestore con ID:", docRef.id);
    } catch (firestoreError) {
      console.error("❌ Error guardando en Firestore:", firestoreError);

      // Si falla Firestore, intentamos eliminar el usuario de Auth para consistencia
      try {
        await firebaseUser.delete();
        console.log("Usuario de Auth eliminado por consistencia");
      } catch (deleteError) {
        console.error("No se pudo eliminar el usuario de Auth:", deleteError);
      }

      // Determinar si es error de permisos
      if (firestoreError.code === "permission-denied") {
        return {
          success: false,
          error: "PERMISSION_DENIED",
          message:
            "Error de permisos en la base de datos. Verifica las reglas de Firestore.",
        };
      }

      return {
        success: false,
        error: firestoreError.code || "FIRESTORE_ERROR",
        message:
          "Error al guardar en la base de datos: " + firestoreError.message,
      };
    }

    // 4. Guardar en sesión
    const userSession = {
      uid: firebaseUser.uid,
      email: userData.email,
      nombre: userData.name || userData.nombre || "",
      telefono: userData.phone || userData.telefono || "",
      fechaRegistro: new Date().toISOString(),
    };
    sessionStorage.setItem("user", JSON.stringify(userSession));

    return { success: true, userId: firebaseUser.uid };
  } catch (e) {
    console.error("❌ Error en createUser:", e);

    // Manejar errores específicos de Auth
    if (e.code === "auth/email-already-in-use") {
      return {
        success: false,
        error: "EMAIL_EXISTS",
        message: "Este correo ya está registrado",
      };
    } else if (e.code === "auth/invalid-email") {
      return {
        success: false,
        error: "INVALID_EMAIL",
        message: "Correo electrónico inválido",
      };
    } else if (e.code === "auth/weak-password") {
      return {
        success: false,
        error: "WEAK_PASSWORD",
        message: "La contraseña debe tener al menos 6 caracteres",
      };
    } else if (e.code === "auth/network-request-failed") {
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "Error de red. Verifica tu conexión.",
      };
    }

    return {
      success: false,
      error: e.code || "UNKNOWN_ERROR",
      message: e.message,
    };
  }
};

// Obtener usuario actual de la sesión
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Obtener datos completos del usuario (para debugging)
export const getCurrentUserData = () => {
  const user = getCurrentUser();
  if (user && user.uid) {
    return getUserData(user.uid);
  }
  return null;
};

// Cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
    sessionStorage.removeItem("user");
    window.location.href = "signin.html";
    return true;
  } catch (error) {
    console.error("Error cerrando sesión: ", error);
    return false;
  }
};

// ===== FUNCIÓN: Actualizar perfil de usuario =====
export const updateUserProfile = async (profileData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No hay usuario logueado");

    // Buscar el documento en Firestore por UID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Obtener el ID del documento
      const docId = querySnapshot.docs[0].id;
      const userDoc = doc(db, "users", docId);

      // Actualizar solo los campos proporcionados
      await updateDoc(userDoc, profileData);

      // Actualizar sessionStorage con los nuevos datos
      const updatedUser = {
        ...currentUser,
        ...profileData,
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      console.log("Perfil actualizado correctamente");
      return { success: true };
    } else {
      throw new Error("Usuario no encontrado en Firestore");
    }
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return { success: false, error: error.message };
  }
};

// ===== FUNCIONES PARA PEDIDOS =====

// Obtener pedidos de un usuario específico
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Ordenar por fecha (más reciente primero)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    return orders;
  } catch (e) {
    console.error("Error obteniendo pedidos del usuario: ", e);
    return [];
  }
};

// Obtener un pedido específico por ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data(),
      };
    } else {
      console.log("No such order!");
      return null;
    }
  } catch (e) {
    console.error("Error obteniendo pedido: ", e);
    return null;
  }
};

// Actualizar estado de un pedido
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: status,
      updatedAt: new Date().toISOString(),
    });
    console.log("Estado de pedido actualizado:", orderId);
    return true;
  } catch (e) {
    console.error("Error actualizando estado del pedido: ", e);
    return false;
  }
};

export const getInitToken = async (registration) => {
  // NOTA: messaging no está inicializado, necesitas descomentar y configurar messaging
  //   const messaging = getMessaging();

  // Solicitar permiso para mostrar notificaciones
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Permiso para notificaciones concedido.");

      // Obtener el token de FCM, y especificar el registro del Service Worker

      getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey:
          "BO905tgtG6e5FIrh-d9bIXVZuL6cv024kw1ygHLDwrrMk55S06h7elY0YuKKpNR4egBoSabvG-OS6kbGTrfF9A0",
      })
        .then((currentToken) => {
          console.log("Permiso para currentToken.");
          if (currentToken) {
            console.log("Token FCM:", currentToken);

            localStorage.setItem("fcm_token", currentToken);
            // Envia el token al servidor
          } else {
            console.log("No se pudo generar un token.");
          }
        })
        .catch((err) => {
          console.error("Error al obtener el token:", err);
        });
    } else {
      console.error("No se otorgaron permisos para notificaciones.");
    }
  });

  // Manejar mensajes cuando la app esta en primer plano
  onMessage(messaging, (payload) => {
    console.log("Mensaje recibido en primer plano:", payload);
    // Personaliza la notificacinn
  });
};
// assets/js/firebase.js

export async function sendPushNotification(userName, total) {
  const fcmToken = localStorage.getItem("fcm_token");
  if (!fcmToken) {
    console.warn("No hay token de notificación guardado.");
    return;
  }

  console.log(fcmToken);
  // Configuración del mensaje
  const message = {
    to: fcmToken,
    notification: {
      title: "¡Pedido Confirmado! 🛍️",
      body: `Hola ${userName}, recibimos tu compra por $${total.toFixed(2)}. ¡Gracias por elegir Vale-Shop!`,
      icon: "./assets/icons/icon-192x192.png",
      click_action: "./orders.html",
    },
    priority: "high",
  };

  try {
    console.log(fcmToken);
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const fcmUrl = "https://fcm.googleapis.com/fcm/send";
    await fetch(proxyUrl + fcmUrl, {
      method: "POST",
      headers: {
        Authorization: `key=${fcmToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error al enviar la push:", error);
  }
}
