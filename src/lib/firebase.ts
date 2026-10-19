/**
 * Firebase project for live devices (free Spark plan; data protection is in the database
 * security rules: OASIS_official_website/backend/connected-firebase/database.rules.json).
 * These values identify the app; they are not secrets.
 * The SDK is loaded only from "Sign in to my VenGuard" on, so the welcome screen stays small and fast.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyBhorrXE1tw7IH1CqUpvOYNgQaKpW4xOoA",
  authDomain: "venguard-connected.firebaseapp.com",
  databaseURL: "https://venguard-connected-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "venguard-connected",
  storageBucket: "venguard-connected.firebasestorage.app",
  messagingSenderId: "879846682462",
  appId: "1:879846682462:web:7ae3b1f81bbefcdab0e9cf",
};

/** Seconds without a heartbeat before a device counts as offline (devices beat every 60 s). */
export const OFFLINE_AFTER_S = 180;
