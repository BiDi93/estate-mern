// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-muhaimin.firebaseapp.com",
  projectId: "estate-muhaimin",
  storageBucket: "estate-muhaimin.appspot.com",
  messagingSenderId: "1099054222667",
  appId: "1:1099054222667:web:3bdffea5e2ecf9e8262cce",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
