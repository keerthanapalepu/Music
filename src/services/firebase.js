// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyBsCMYh2xXTjTMDyvhbGj6qKsFvY7lvnT0",
  authDomain: "music-20588.firebaseapp.com",
  databaseURL: "https://music-20588-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "music-20588",
  storageBucket: "music-20588.appspot.com",
  messagingSenderId: "856037638200",
  appId: "1:856037638200:web:7b7babf93bc24a95c726cd",
  measurementId: "G-8P1XJKZYF6"
};




const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);