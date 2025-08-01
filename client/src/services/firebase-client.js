import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6ZtZgTu5wF0V3Ws0wakHNHMTpvz1l8YM",
  authDomain: "spa-management-3f4a3.firebaseapp.com",
  projectId: "spa-management-3f4a3",
  storageBucket: "spa-management-3f4a3.firebasestorage.app",
  messagingSenderId: "914552805515",
  appId: "1:914552805515:web:76945e3ef9896ee5eb5c8e",
  measurementId: "G-WKJT9X5R5P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Function to handle Google sign-in
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    throw error;
  }
};

// Function to handle sign out
const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { db, auth, signInWithGoogle, signOutUser };