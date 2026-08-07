// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEwn9-z_WS1tZgwv1fCgBe-MBJeu85fU4",
  authDomain: "cebin-pro.firebaseapp.com",
  projectId: "cebin-pro",
  storageBucket: "cebin-pro.firebasestorage.app",
  messagingSenderId: "1046340307501",
  appId: "1:1046340307501:web:ccf2f8c428c6d71efdc6a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
