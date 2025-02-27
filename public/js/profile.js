import { auth, db } from "./firebase.js";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { updateEmail, updatePassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

let currentUserId = null;
let currentUserDocId = null; // Store Firestore Document ID

// Function to load user profile
async function loadUserProfile(user) {
    if (!user) {
        document.body.innerHTML = "<h2>Please log in first.</h2><a href='index.html'>Go to Login</a>";
        return;
    }

    currentUserId = user.uid;

    // Fetch username from Firestore
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("uid", "==", currentUserId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        document.getElementById("message").innerText = "User not found. Please sign in again.";
        return;
    }

    // Get first document (since UID is unique)
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    currentUserDocId = userDoc.id; // Save document ID for updates

    // Populate fields with user data
    document.getElementById("username").value = userData.username || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("bio").value = userData.bio || "";
    document.getElementById("profilePic").src = userData.profilePic || "";
}

// Function to update profile data in Firestore
async function updateUserProfile() {
    const newUsername = document.getElementById("username").value.trim();
    const newProfilePic = document.getElementById("newProfilePic").value.trim();
    const newBio = document.getElementById("bio").value.trim();

    if (!newUsername) {
        document.getElementById("message").innerText = "Username cannot be empty.";
        return;
    }

    try {
        const userRef = doc(db, "users", currentUserDocId);
        await updateDoc(userRef, {
            username: newUsername,
            profilePic: newProfilePic,
            bio: newBio
        });

        document.getElementById("message").innerText = "Profile updated!";
    } catch (error) {
        console.error("Error updating profile:", error);
        document.getElementById("message").innerText = "Error updating profile.";
    }
}

// Function to change password
async function changePassword() {
    const newPassword = document.getElementById("newPassword").value;
    if (!newPassword) {
        document.getElementById("message").innerText = "Enter a new password.";
        return;
    }

    try {
        await updatePassword(auth.currentUser, newPassword);
        document.getElementById("message").innerText = "Password changed successfully!";
    } catch (error) {
        console.error("Error changing password:", error);
        document.getElementById("message").innerText = error.message;
    }
}

// Detect auth state changes and load profile when logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
    } else {
        document.body.innerHTML = "<h2>Please log in first.</h2><a href='index.html'>Go to Login</a>";
    }
});

// Attach event listeners
document.getElementById("updateProfileBtn").addEventListener("click", updateUserProfile);
document.getElementById("changePasswordBtn").addEventListener("click", changePassword);
