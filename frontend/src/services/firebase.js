// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApUTKNsiPSLP1TkhapQgD5wXZSriZZhtc",
  authDomain: "bankx-zespol8.firebaseapp.com",
  projectId: "bankx-zespol8",
  storageBucket: "bankx-zespol8.firebasestorage.app",
  messagingSenderId: "321558989889",
  appId: "1:321558989889:web:f800a100fe6f84a04b4ac0",
  measurementId: "G-ZPLSYLR7M4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); 
export const db = getFirestore(app);
