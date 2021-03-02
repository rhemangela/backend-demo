var express = require("express");
var cors = require("cors");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = express();
var flash = require("connect-flash");
var validator = require("express-validator");
var firebaseAdmin = require("./external-connection/connect-firebaseAdmin.js");
var firebase = require("./external-connection/connect-firebase.js");
// session
var session = require("express-session");
app.use(express.static("public"));
app.use(
  session({ secret: "mysupersecret", resave: true, saveUninitialized: true })
);
app.use(flash());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    credentials: true
  })
);

// =========ADMIN REQUESTS===========
app.post("/admin/user_info", (req, res) => {
  var name = req.body.name;
  var no = req.body.no;
  var address = req.body.address;
  var uid = req.body.uid;

  firebaseAdmin
    .collection("user_info")
    .doc(uid)
    .set({ uid: uid, name: name, no: no, address: address })
    .then(() =>
      res.send({
        success: true,
        data: { uid: uid, name: name, no: no, address: address }
      })
    )
    .catch(() => {
      res.send({ success: false });
    });
});

// =========GET reports REQUESTS===========
app.post("/admin/reports", function(req, res) {
  let uid = req.body.uid;
  let results = [];
  firebaseAdmin
    .collection("user")
    .where("uid", "==", uid)
    .get()
    .then((snapshot) => {
      snapshot.docs.map((doc) => results.push(doc.data()));
      res.send({ success: true, results: results });
    })
    .catch(() => {
      res.send({ success: false, data: "fail to GET data" });
    });
});

// =========POST report REQUESTS===========
app.post("/admin/new_report", function(req, res) {
  var patient = req.body.patient;
  var date = req.body.date;
  var diagonsis = req.body.diagonsis;
  var isFollowUp = req.body.isFollowUp;
  var uid = req.body.uid;

  firebaseAdmin
    .collection("user")
    .doc()
    .set({
      uid: uid,
      patient: patient,
      date: date,
      diagonsis: diagonsis,
      isFollowUp: isFollowUp
    })
    .then(() =>
      res.send({
        success: true,
        data: {
          uid: uid,
          patient: patient,
          date: date,
          diagonsis: diagonsis,
          isFollowUp: isFollowUp
        }
      })
    )
    .catch(() => {
      res.send({ success: false, data: "fail to POST data" });
    });
});

// =========LOGIN REQUESTS===========
app.post("/login", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var token;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function(response) {
      let uid = response.user.uid;
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(function(idToken) {
          token = idToken;
          req.session.token = { token: token, uid: uid };
          res.send({
            uid: uid,
            token: token,
            success: true
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(() => {
      res.send({ success: false, data: "fail to login" });
    });
});

// =========SIGNUP REQUESTS===========
app.post("/signup", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function(response) {
      let uid = response.user.uid;

      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(function(idToken) {
          token = idToken;
          req.session.token = { token: token, uid: uid };
          res.send({
            uid: uid,
            token: token,
            success: true
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(() => res.send({ success: false, data: "fail to signup" }));
});

// =========TESTING===========
app.get("/", (req, res) => {
  res.send("testing admin");
});

// error handlers
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err
  });
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

var port = 3003;
app.listen(port);

module.exports = app;

// if using express routes
// var login = require("./routes/login");
// var admin = require("./routes/admin");
// var signup = require("./routes/signup");
// app.use("/login", login);
// app.use("/signup", signup);

// app.use(function(req, res, next) {
//   if (req.session.token) {
//     res.send(success.true);
//     return next();
//   } else {
//     console.log("NOT authorizied");
//     var err = new Error("Unauthorized");
//     err.status = 401;
//     res.send({ success: false });
//   }
// });
