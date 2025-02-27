// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMiqpvbBYRYUeBJ7rB2h6GV0z_5MFyUrk",
  authDomain: "secondhandapp-8410d.firebaseapp.com",
  databaseURL: "https://secondhandapp-8410d-default-rtdb.firebaseio.com",
  projectId: "secondhandapp-8410d",
  storageBucket: "secondhandapp-8410d.firebasestorage.app",
  messagingSenderId: "952829070842",
  appId: "1:952829070842:web:aacef8943e5b68bae22843",
  measurementId: "G-YMZVJKJPRZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Login Function
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in:", userCredential.user);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
  }
});

// Signup Function
document.getElementById("signupBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up:", userCredential.user);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(error.message);
  }
});

// Ensure users are redirected based on authentication state
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;
  if (user) {
    if (currentPage.includes("login.html")) {
      window.location.href = "index.html";
    }
  } else {
    if (!currentPage.includes("login.html")) {
      window.location.href = "login.html";
    }
  }
});

// Logout function
document.getElementById("logoutBtn")?.addEventListener("click", (event) => {
  event.preventDefault();
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
});
async function loadItems(category = "") {
  console.log("Fetching items for category:", category);
  const itemsList = document.getElementById("itemsList");
  if (!itemsList) return;

  itemsList.innerHTML = "<p>Loading items...</p>";
  let q = collection(db, "items");

  if (category) {
    q = query(q, where("category", "==", category));
  }

  try {
    const querySnapshot = await getDocs(q);
    itemsList.innerHTML = "";

    if (querySnapshot.empty) {
      itemsList.innerHTML = "<p>No items found.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      console.log("Item fetched:", item); // Debug log
      const itemElement = document.createElement("div");
      itemElement.classList.add("marketplace-item");
      itemElement.innerHTML = `
              <img src="${item.imageUrl}" alt="${item.name}" width="150">
              <h3>${item.name}</h3>
              <p>Category: ${item.category}</p>
              <p>Price: $${item.price}</p>
              <p>Seller: ${item.seller}</p>
          `;
      itemsList.appendChild(itemElement);
    });
  } catch (error) {
    console.error("Error loading marketplace items:", error);
    itemsList.innerHTML = "<p>Error loading items.</p>";
  }
}

// Ensure items load on page load
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("index.html")) {
    loadItems(); // Load all items by default
  }
});
