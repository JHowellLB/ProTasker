// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3IZvUUPQkWaYNGZAsQEHtKpYTOUv3IHU",
  authDomain: "protasker-e361e.firebaseapp.com",
  projectId: "protasker-e361e",
  storageBucket: "protasker-e361e.appspot.com",
  messagingSenderId: "89111799986",
  appId: "1:89111799986:web:9346a9e3c51901da09c1ab",
  measurementId: "G-ZG148V6LMF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
