// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAHMkpJt9GM656Hbg66NMdXV-DASwE63MY",
    authDomain: "hirelistic.firebaseapp.com",
    projectId: "hirelistic",
    storageBucket: "hirelistic.firebasestorage.app",
    messagingSenderId: "920940469714",
    appId: "1:920940469714:web:9444ae56a6fde6d4353c0b",
    measurementId: "G-5HDF7RJJLN"
};
export const auth = getAuth(app);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);