import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCB_hZDq2lLLcX71LqclwgEAqQsK4gk1d0",
  authDomain: "rsvp-app-4cab6.firebaseapp.com",
  projectId: "rsvp-app-4cab6",
  storageBucket: "rsvp-app-4cab6.firebasestorage.app",
  messagingSenderId: "429949084982",
  appId: "1:429949084982:web:e215d54f1ac004a98e3f97",
  measurementId: "G-WN71MGEP9E"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchFamily  = async (code) => {
  const ref = doc(db, 'rsvps', code);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveRSVP  = async (code, guests, contact) => {
  const ref = doc(db, 'rsvps', code);
  await updateDoc(ref, { guests, contact });
};