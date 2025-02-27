// Import Firebase Authentication
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Function to handle login
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    localStorage.setItem("user", JSON.stringify(userCredential.user));
    showAuthenticatedUI(); // Show relevant UI after login
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}

// Function to handle sign-up
async function signup() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    localStorage.setItem("user", JSON.stringify(userCredential.user));
    showAuthenticatedUI(); // Show relevant UI after signup
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
}

// Function to check authentication status and toggle UI
tonAuthStateChanged(auth, (user) => {
  if (user) {
    showAuthenticatedUI();
  } else {
    showLoginUI();
  }
});

// Function to handle logout
function logout() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      showLoginUI(); // Show login UI after logout
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
}

// Function to show authenticated UI
function showAuthenticatedUI() {
  document.getElementById("authOptions").style.display = "none";
  document.getElementById("userOptions").style.display = "block";
}

// Function to show login UI
function showLoginUI() {
  document.getElementById("authOptions").style.display = "block";
  document.getElementById("userOptions").style.display = "none";
}

// Attach event listeners
document.getElementById("loginBtn")?.addEventListener("click", login);
document.getElementById("signupBtn")?.addEventListener("click", signup);
document.getElementById("logoutBtn")?.addEventListener("click", logout);
