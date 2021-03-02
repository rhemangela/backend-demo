var firebase = require("firebase");
var firebaseConfig = {
  apiKey: "AIzaSyCvvKaBjVeTYriJfb2GWxtZ2O9Lk1xJ5cw",
  authDomain: "backend-7fa86.firebaseapp.com",
  databaseURL: "https://backend-7fa86-default-rtdb.firebaseio.com",
  projectId: "backend-7fa86",
  storageBucket: "backend-7fa86.appspot.com",
  messagingSenderId: "608933672598",
  appId: "1:608933672598:web:627f2e77243f336555b4b7"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

var db = firebase;
module.exports = db;
