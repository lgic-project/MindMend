import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore, initializeFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAoC0EuUXWq0jzxxkmSpDmaEcvmX7c_bSs",
  authDomain: "mindmend-58c20.firebaseapp.com",
  projectId: "mindmend-58c20",
  storageBucket: "mindmend-58c20.appspot.com",
  messagingSenderId: "821823643087",
  appId: "1:821823643087:web:48b3077c6133576d2506ba",
  measurementId: "G-C6QY02F3D1",
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const database = getFirestore(app)
