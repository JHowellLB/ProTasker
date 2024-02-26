// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhm5xeB8u8zoKtLP551q9PZrSNq3Ag5p0",
  authDomain: "protasker-ffce0.firebaseapp.com",
  projectId: "protasker-ffce0",
  storageBucket: "protasker-ffce0.appspot.com",
  messagingSenderId: "112333161415",
  appId: "1:112333161415:web:6d032b22146cd16eba8fe2",
  measurementId: "G-KBT6NK6CN3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: "select_account ",
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export default { app };
