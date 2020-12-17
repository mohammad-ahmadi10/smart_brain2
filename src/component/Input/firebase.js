// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';


const configFirebase = {
    apiKey: "AIzaSyB-XfMylzwsE311yLEVSqAXrC5OKVhLmsQ",
    authDomain: "face-detetion-b7484.firebaseapp.com",
    databaseURL: "https://face-detetion-b7484.firebaseio.com",
    projectId: "face-detetion-b7484",
    storageBucket: "face-detetion-b7484.appspot.com",
    messagingSenderId: "558960084283",
    appId: "1:558960084283:web:b6ea0e48856a8a346b631e",
    measurementId: "G-Q5520N76P5"
};

firebase.initializeApp(configFirebase);


export default firebase;