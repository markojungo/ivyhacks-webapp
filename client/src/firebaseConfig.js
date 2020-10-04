const firebase = require("firebase");
// Required for side-effects
require("firebase/functions");
// firebase.functions().useFunctionsEmulator("http://localhost:5001")

var firebaseConfig = {
  apiKey: "AIzaSyD1Mmgga_0dRGnu9f3E4oTVVRhfOp70E-s",
  authDomain: "ivyhacks-backend.firebaseapp.com",
  databaseURL: "https://ivyhacks-backend.firebaseio.com",
  projectId: "ivyhacks-backend",
  storageBucket: "ivyhacks-backend.appspot.com",
  messagingSenderId: "786030276950",
  appId: "1:786030276950:web:33695f02b0bf4a8039a6f7",
  measurementId: "G-YMCDEJK6X8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const functions = firebase.functions();

export {
  firebase,
  db,
  functions
}