
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; // Fixed import path to match our file structure

// Initialize Firebase Auth
const auth = getAuth(app);

// Sign Up Function
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign Up Error: ", error);
    throw error;
  }
};

// Sign In Function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign In Error: ", error);
    throw error;
  }
};

// Sign Out Function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error: ", error);
    throw error;
  }
};

export { auth };
