import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function signup() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Check if all fields are filled
    if (!username || !email || !password) {
        document.getElementById("message").innerText = "Please fill in all fields.";
        return;
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user profile in Firestore using username as the document ID
        await setDoc(doc(db, "users", username), {
            uid: user.uid,
            email: email,
            username: username,
            createdAt: new Date(),
        });

        document.getElementById("message").innerText = "Signup successful! You can now log in.";
    } catch (error) {
        console.error("Signup error:", error);
        document.getElementById("message").innerText = "Error: " + error.message;
    }
}

// Attach signup function to button
document.getElementById("signupBtn").addEventListener("click", signup);
