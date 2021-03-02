var admin = require("firebase-admin");
var serviceAccount = require("../firestore_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://backend-7fa86-default-rtdb.firebaseio.com"
});
// var db = admin.database(); // if use realtime database
var db = admin.firestore();

module.exports = db;
