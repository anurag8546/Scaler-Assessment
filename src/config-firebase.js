import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDhddl8WrvV3UQro3t7M6Yopg6e6DUad2g",
    authDomain: "scaler-2cc53.firebaseapp.com",
    projectId: "scaler-2cc53",
    storageBucket: "scaler-2cc53.appspot.com",
    messagingSenderId: "1043486442376",
    appId: "1:1043486442376:web:2e6eea0b647a334d0ff03d"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);