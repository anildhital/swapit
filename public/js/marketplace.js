// Import Firebase SDK
import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Ensure user is authenticated before accessing the marketplace
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
  }
});

// Function to load marketplace items
async function loadMarketplaceItems() {
  const itemsList = document.getElementById("marketplaceItems");
  itemsList.innerHTML = "Loading items...";

  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    itemsList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      itemsList.innerHTML += `
        <div class="item">
          <img src="${item.imageUrl}" alt="${item.name}" width="100" height="100" />
          <h3>${item.name}</h3>
          <p>Category: ${item.category}</p>
          <p>Price: $${item.price}</p>
          <p>Seller: ${item.seller}</p>
        </div>`;
    });
  } catch (error) {
    itemsList.innerHTML = "Failed to load items.";
    console.error("Error loading marketplace items:", error);
  }
}

// Attach event listener to load items when page loads
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("marketplace.html")) {
    loadMarketplaceItems();
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
