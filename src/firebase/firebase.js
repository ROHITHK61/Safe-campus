import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLFJdCru7n25uv-s6h-i4TOlPaXfUmrjo",
  authDomain: "campus-safety-system-b9f73.firebaseapp.com",
  projectId: "campus-safety-system-b9f73",
  storageBucket: "campus-safety-system-b9f73.firebasestorage.app",
  messagingSenderId: "425163111810",
  appId: "1:425163111810:web:e97a0a198e8d1ec8c7a39b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);