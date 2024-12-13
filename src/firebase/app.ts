import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCnuCOXpXbizH2_ovKQcw22e5PhnQ7jxmo",
  authDomain: "csuportal-f2c0a.firebaseapp.com",
  projectId: "csuportal-f2c0a",
  storageBucket: "csuportal-f2c0a.firebasestorage.app",
  messagingSenderId: "635866899671",
  appId: "1:635866899671:web:fa57bd230e07a28d71bc92",
  measurementId: "G-TZDQB5VTK1",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export default app;
