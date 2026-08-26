/**
 * ============================================================================
 * FIREBASE CONNECTION — real shared storage for the arcade leaderboard and
 * the "Your Relegated Tales" board, so every visitor (any browser, any
 * device) sees the same data instead of only what's in their own browser.
 * ============================================================================
 * This config object is NOT a secret — Firebase web config is meant to be
 * public (it ships inside every visitor's browser automatically). Real
 * protection comes from the Firestore Security Rules set in the Firebase
 * console, not from hiding this file.
 * ============================================================================
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaqN_jQrut1Z9SXwZWv4zW980FhRH3qoU",
  authDomain: "ghaithdev-feb79.firebaseapp.com",
  projectId: "ghaithdev-feb79",
  storageBucket: "ghaithdev-feb79.firebasestorage.app",
  messagingSenderId: "512488555765",
  appId: "1:512488555765:web:e9037af7082ebe8185f1bc",
  measurementId: "G-KF2FDMLMMJ"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
