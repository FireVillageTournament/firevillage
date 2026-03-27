// ════════════════════════════════════════════════
// src/firebase-init.js - Centralized Firebase Initialization
// ════════════════════════════════════════════════

// Firebase Configuration
// WARNING: For client-side code, while this is common,
// for production applications, consider using Firebase Admin SDK
// with backend functions or environment variables to protect your API keys
// if sensitive operations are involved. For simple read/write, this is fine.
const firebaseConfig = {
  apiKey: "AIzaSyDFjHR5_D6yQ9tXrEut-3c2o4oA1ddz6hQ",
  authDomain: "firevillagetournament.firebaseapp.com",
  projectId: "firevillagetournament",
  storageBucket: "firevillagetournament.firebasestorage.app",
  messagingSenderId: "511246704009",
  appId: "1:511246704009:web:8ae5e484591a64bb735558",
  measurementId: "G-ZCQ2V6DEGX"
};

let auth = null;
let db = null;
let storage = null; // Add storage for payment.html
let firebaseReady = false;

try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage(); // Initialize storage
  firebaseReady = true;
  console.log("✅ Firebase app initialized successfully.");
} catch (e) {
  console.warn("❌ Firebase initialization failed. Using demo data/offline mode.", e);
}

export { auth, db, storage, firebaseReady };
