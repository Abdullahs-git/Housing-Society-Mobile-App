import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPujmzWYgPATJiHJ2vRJdngGM4--Be3jM",
  authDomain: "society-57457.firebaseapp.com",
  databaseURL: "https://society-57457-default-rtdb.firebaseio.com",
  projectId: "society-57457",
  storageBucket: "society-57457.firebasestorage.app",
  messagingSenderId: "1513819947",
  appId: "1:1513819947:web:d410f3c96870ba8636ff6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
export {auth,database};