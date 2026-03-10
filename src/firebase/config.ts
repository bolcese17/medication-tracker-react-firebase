import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXgtYrf2zIY2gQvOvymePBALIWdz1VioU",
  authDomain: "med-tracker-f9d57.firebaseapp.com",
  projectId: "med-tracker-f9d57",
  storageBucket: "med-tracker-f9d57.firebasestorage.app",
  messagingSenderId: "78858298829",
  appId: "1:78858298829:web:be1d84e53aec2f8fa21084",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);