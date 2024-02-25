// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// import {
//   API_KEY,
//   AUTH_DOMAIN,
//   PROJECT_ID,
//   STORAGE_BUCKET,
//   MESSAGING_SENDER_ID,
//   APP_ID,
//   MEASUREMENT_ID,
// } from "./config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: API_KEY,
//   authDomain: AUTH_DOMAIN,
//   projectId: PROJECT_ID,
//   storageBucket: STORAGE_BUCKET,
//   messagingSenderId: MESSAGING_SENDER_ID,
//   appId: APP_ID,
//   measurementId: MEASUREMENT_ID,
// };

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
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;
