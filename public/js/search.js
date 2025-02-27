// Import Firebase SDK
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to search items based on name and category
async function searchItems() {
  const searchQuery = document
    .getElementById("searchQuery")
    .value.trim()
    .toLowerCase();
  const categoryFilter = document.getElementById("categoryFilter").value;
  const searchResults = document.getElementById("searchResults");

  searchResults.innerHTML = "<p>Searching...</p>"; // Show loading text

  let q = collection(db, "items");

  // Apply filters
  if (categoryFilter) {
    q = query(q, where("category", "==", categoryFilter));
  }

  try {
    const querySnapshot = await getDocs(q);
    searchResults.innerHTML = "";

    let foundItems = false;
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      // Check if search query matches item name (case insensitive)
      if (!searchQuery || item.name.toLowerCase().includes(searchQuery)) {
        foundItems = true;
        const itemElement = document.createElement("div");
        itemElement.classList.add("search-item");
        itemElement.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>Category: ${item.category}</p>
                    <p>Price: $${item.price}</p>
                    <p>Seller: ${item.seller}</p>
                    <img src="${item.imageUrl}" width="150" alt="${item.name}">
                    <hr>
                `;
        searchResults.appendChild(itemElement);
      }
    });

    if (!foundItems) {
      searchResults.innerHTML = "<p>No matching items found.</p>";
    }
  } catch (error) {
    console.error("Error searching items:", error);
    searchResults.innerHTML = "<p>Error retrieving items.</p>";
  }
}

// Attach event listener for search button
document.getElementById("searchBtn")?.addEventListener("click", searchItems);
