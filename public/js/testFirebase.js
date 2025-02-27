import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function testFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, "testCollection"));
        if (!querySnapshot.empty) {
            document.getElementById("message").innerText = "Firebase is working! 🎉";
        } else {
            document.getElementById("message").innerText = "Connected, but no data found.";
        }
    } catch (error) {
        console.error("Error connecting to Firebase:", error);
        document.getElementById("message").innerText = "Firebase connection failed!";
    }
}

window.testFirebase = testFirebase;
