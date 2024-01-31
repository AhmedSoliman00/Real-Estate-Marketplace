// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-app-1272c.firebaseapp.com",
  projectId: "estate-app-1272c",
  storageBucket: "estate-app-1272c.appspot.com",
  messagingSenderId: "109225775222",
  appId: "1:109225775222:web:96c105fb97d377bb990f57"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);