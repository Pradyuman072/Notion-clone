import { initializeApp,getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyACB-8R5Nrxn_G7bGcDtMGZFF7kQlhgj14",
    authDomain: "notion-clone-3dd51.firebaseapp.com",
    projectId: "notion-clone-3dd51",
    storageBucket: "notion-clone-3dd51.firebasestorage.app",
    messagingSenderId: "521780322077",
    appId: "1:521780322077:web:75cca012647d76406fcbf4"
  };

  const app=getApps().length===0?initializeApp(firebaseConfig):getApp();
  const db=getFirestore(app);
export {db}