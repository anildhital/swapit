import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function loadItems() {
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = ""; // Clear the list before adding new items

    const querySnapshot = await getDocs(collection(db, "items"));

    querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Category: ${item.category}</p>
            <p>Price: $${item.price}</p>
            <p>Seller: ${item.seller}</p>
            <img src="${item.imageUrl}" width="150" alt="${item.name}">
            <hr>
        `;
        itemsList.appendChild(itemElement);
    });
}

// Load items when page loads
window.onload = loadItems;
