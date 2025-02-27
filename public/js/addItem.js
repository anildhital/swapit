// Import Firebase SDK
import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Ensure user is authenticated before accessing the page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
  }
});

// Function to handle adding an item
async function submitItem() {
  const user = auth.currentUser;

  if (!user) {
    document.getElementById("message").innerText =
      "You must be logged in to list an item.";
    return;
  }

  const itemName = document.getElementById("itemName").value.trim();
  const itemCategory = document.getElementById("itemCategory").value.trim();
  const itemPrice = document.getElementById("itemPrice").value.trim();
  const itemImage = document.getElementById("itemImage").value.trim();

  if (!itemName || !itemCategory || !itemPrice || !itemImage) {
    document.getElementById("message").innerText =
      "Please fill out all fields.";
    return;
  }

  try {
    // Get user data from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      document.getElementById("message").innerText =
        "User not found. Please sign in again.";
      return;
    }

    const userData = userSnap.data();
    const username = userData.username || "Unknown Seller";

    // Save item in Firestore
    await addDoc(collection(db, "items"), {
      name: itemName,
      category: itemCategory,
      price: Number(itemPrice),
      imageUrl: itemImage,
      seller: username,
      sellerId: user.uid,
      createdAt: new Date(),
    });

    document.getElementById("message").innerText = "Item listed successfully!";
    document.getElementById("addItemForm").reset(); // Clear form after submission
  } catch (error) {
    console.error("Error adding item:", error);
    document.getElementById("message").innerText = "Error listing item.";
  }
}

// Attach event listener to form submission button
document.getElementById("submitItem")?.addEventListener("click", submitItem);

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
