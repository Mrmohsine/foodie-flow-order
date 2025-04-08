
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// Firebase config with hardcoded values for demo purposes
// IMPORTANT: In a production app, you would use environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual Firebase API key
  authDomain: "your-project-id.firebaseapp.com", // Replace with your actual Firebase auth domain
  projectId: "your-project-id", // Replace with your actual Firebase project ID
  storageBucket: "your-project-id.appspot.com", // Replace with your actual Firebase storage bucket
  messagingSenderId: "your-messaging-sender-id", // Replace with your actual Firebase messaging sender ID
  appId: "your-app-id" // Replace with your actual Firebase app ID
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========== CRUD FUNCTIONS ==========

// Create a document
export const createDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

// Read all documents from a collection
export const readDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Read a single document by ID
export const readDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Update a document by ID
export const updateDocument = async (collectionName, id, newData) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, newData);
};

// Delete a document by ID
export const deleteDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export { db, app };
