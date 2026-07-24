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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
