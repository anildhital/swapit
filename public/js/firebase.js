// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMiqpvbBYRYUeBJ7rB2h6GV0z_5MFyUrk",
  authDomain: "secondhandapp-8410d.firebaseapp.com",
  databaseURL: "https://secondhandapp-8410d-default-rtdb.firebaseio.com",
  projectId: "secondhandapp-8410d",
  storageBucket: "secondhandapp-8410d.firebasestorage.app",
  messagingSenderId: "952829070842",
  appId: "1:952829070842:web:aacef8943e5b68bae22843",
  measurementId: "G-YMZVJKJPRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { auth, db };
