// Import Firebase SDK
import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Ensure Firebase is ready before accessing auth.currentUser
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
  } else {
    loadProfile(); // Load user profile after authentication
  }
});

// Function to create or update user profile
async function saveProfile(event) {
  event.preventDefault(); // Prevent page refresh

  const user = auth.currentUser;
  if (!user) {
    document.getElementById("profileMessage").innerText =
      "You must be logged in to update your profile.";
    return;
  }

  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!fullName || !phoneNumber || !address) {
    document.getElementById("profileMessage").innerText =
      "Please fill out all fields.";
    return;
  }

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        username: fullName,
        phone: phoneNumber,
        address: address,
        email: user.email,
      },
      { merge: true }
    );

    document.getElementById("profileMessage").innerText =
      "Profile updated successfully!";
  } catch (error) {
    console.error("Error updating profile:", error);
    document.getElementById("profileMessage").innerText =
      "Error updating profile.";
  }
}

// Function to load user profile data
async function loadProfile() {
  const user = auth.currentUser;
  if (!user) {
    document.getElementById("profileMessage").innerText =
      "You must be logged in to view your profile.";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      document.getElementById("fullName").value = userData.username || "";
      document.getElementById("phoneNumber").value = userData.phone || "";
      document.getElementById("address").value = userData.address || "";
    } else {
      document.getElementById("profileMessage").innerText =
        "No profile found. Please fill in your details.";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    document.getElementById("profileMessage").innerText =
      "Error loading profile.";
  }
}

// Ensure the profile form is properly linked
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    loadProfile();
  }

  // Attach event listener only when the button is available
  const saveProfileButton = document.getElementById("saveProfile");
  if (saveProfileButton) {
    saveProfileButton.addEventListener("click", saveProfile);
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
