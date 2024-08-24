// Importa las funciones que necesitas desde el SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Configuración de tu aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtvzthOBRzEbKJsOgZN7OsT_ZM_wun3Kk",
  authDomain: "jeicydelivery.firebaseapp.com",
  projectId: "jeicydelivery",
  storageBucket: "jeicydelivery.appspot.com",
  messagingSenderId: "98258661744",
  appId: "1:98258661744:web:c76a7109c4f3d5b4cc9fb5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };