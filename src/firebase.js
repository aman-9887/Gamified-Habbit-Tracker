import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD3s3uuzF3gxLMNBo-D90Md7Z2oeFeZuno",
    authDomain: "gamified-habit-tracker-a3e1a.firebaseapp.com",
    projectId: "gamified-habit-tracker-a3e1a",
    storageBucket: "gamified-habit-tracker-a3e1a.firebasestorage.app",
    messagingSenderId: "58385071542",
    appId: "1:58385071542:web:5420eda970104d96a15517"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword };
