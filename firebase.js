// Firebase Setup (JS Version)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ---------------- CONFIG ----------------
const firebaseConfig = {
  apiKey: "AIzaSyDzjPx-XGYAd3oSbCGCutAFSvBZOtW3fm4",
  authDomain: "digitwin-1b46b.firebaseapp.com",
  projectId: "digitwin-1b46b",
  storageBucket: "digitwin-1b46b.appspot.com",       // FIXED typo (must be .appspot.com)
  messagingSenderId: "615875565866",
  appId: "1:615875565866:web:74c194df01df88a1182653"
};

// ---------------- INIT ----------------
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ---------------- SAVE SIMULATION ----------------
export async function saveSimulation(result) {
  const user = auth.currentUser;

  if (!user) {
    console.warn("User not logged in → cannot save.");
    return;
  }

  try {
    await addDoc(collection(db, "users", user.uid, "simulations"), {
      ...result,
      createdAt: serverTimestamp()
    });

    console.log("Simulation saved to Firestore!");
  } catch (error) {
    console.error("Saving simulation failed:", error);
  }
}
