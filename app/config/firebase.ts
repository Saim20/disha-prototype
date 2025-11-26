// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDWSHzR_bzRnxKuptpk4zSLTOE9HYbzdvM",

  authDomain: "disha-84d17.firebaseapp.com",

  projectId: "disha-84d17",

  storageBucket: "disha-84d17.firebasestorage.app",

  messagingSenderId: "288529284328",

  appId: "1:288529284328:web:169e63781408d7a880dd5d",

  measurementId: "G-EYX7QY8E8S"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);