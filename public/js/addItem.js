import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function submitItem() {
  const user = auth.currentUser;

  if (!user) {
    document.getElementById("message").innerText =
      "You must be logged in to list an item.";
    return;
  }

  const itemName = document.getElementById("itemName").value;
  const itemCategory = document.getElementById("itemCategory").value;
  const itemPrice = document.getElementById("itemPrice").value;
  const itemImage = document.getElementById("itemImage").value;

  if (!itemName || !itemCategory || !itemPrice || !itemImage) {
    document.getElementById("message").innerText =
      "Please fill out all fields.";
    return;
  }

  try {
    // Query Firestore to get the username using the user's UID
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      document.getElementById("message").innerText =
        "User not found. Please sign in again.";
      return;
    }

    // Get the first document (since UID is unique)
    const userData = querySnapshot.docs[0].data();
    const username = userData.username;

    // Save item in Firestore under "items" collection
    await addDoc(collection(db, "items"), {
      name: itemName,
      category: itemCategory,
      price: Number(itemPrice),
      imageUrl: itemImage,
      seller: username, // Store the username instead of email
      createdAt: new Date(),
    });

    document.getElementById("message").innerText = "Item listed successfully!";
  } catch (error) {
    console.error("Error adding item:", error);
    document.getElementById("message").innerText = "Error listing item.";
  }
}

document.getElementById("submitItem").addEventListener("click", submitItem);
