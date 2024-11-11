// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANI-07FLgHsUG3DgZjWxj4UTkAJtOIr-Q",
  authDomain: "extra-time-blog.firebaseapp.com",
  projectId: "extra-time-blog",
  storageBucket: "extra-time-blog.appspot.com",
  messagingSenderId: "66015460447",
  appId: "1:66015460447:web:8bc3ad7f4af4bbd344efea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app);


export { app, auth, db}; 