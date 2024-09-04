// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAtJ2hHWmKbQ5YYKyCScll_yTzZap9icw",
  authDomain: "my-app-6bbca.firebaseapp.com",
  projectId: "my-app-6bbca",
  storageBucket: "my-app-6bbca.appspot.com",
  messagingSenderId: "325966118951",
  appId: "1:325966118951:web:c0a575e097a2fbe10f8e02",
  measurementId: "G-K9REVXV6EL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);

export let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}