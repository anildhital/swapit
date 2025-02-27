import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function searchItems() {
    const searchQuery = document.getElementById("searchQuery").value.trim().toLowerCase();
    const categoryFilter = document.getElementById("categoryFilter").value;
    const searchResults = document.getElementById("searchResults");
    
    searchResults.innerHTML = ""; // Clear previous results

    let q = collection(db, "items");

    // Apply filters
    if (categoryFilter) {
        q = query(q, where("category", "==", categoryFilter));
    }

    try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            // Check if search query matches item name (case insensitive)
            if (!searchQuery || item.name.toLowerCase().includes(searchQuery)) {
                const itemElement = document.createElement("div");
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

        if (searchResults.innerHTML === "") {
            searchResults.innerHTML = "<p>No matching items found.</p>";
        }

    } catch (error) {
        console.error("Error searching items:", error);
        searchResults.innerHTML = "<p>Error retrieving items.</p>";
    }
}

document.getElementById("searchBtn").addEventListener("click", searchItems);
