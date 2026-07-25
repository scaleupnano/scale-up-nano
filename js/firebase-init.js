/* ==========================================================================
   Scale Up Nano — Firebase initialization

   Fill in the six values below from your Firebase project:
   Firebase Console → Project settings (gear icon) → General tab →
   "Your apps" → the web app → SDK setup and configuration → Config.

   This file is loaded by every page (public pages AND admin.html), so
   it must come after the firebase-*-compat.js <script> tags and before
   any other script that uses `db`, `auth`, or `storage`.
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyC40-dwjYoDbPAbxFrtvVhoB1snpC4F6yc",
  authDomain: "scale-up-nano.firebaseapp.com",
  projectId: "scale-up-nano",
  storageBucket: "scale-up-nano.firebasestorage.app",
  messagingSenderId: "1075963546243",
  appId: "1:1075963546243:web:7e0921d622fad9694c29b6"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
/* Storage is intentionally not initialized — photos are compressed
   client-side and stored directly in Firestore instead, so this site
   works entirely on Firebase's free Spark plan with no billing setup. */
