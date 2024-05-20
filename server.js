var dotenv = require("dotenv");

dotenv.config();

var express = require("express");

var app = express();

const PORT = process.env.PORT || 3001;

const User = require("./api/models/userModel");

const Note = require("./api/models/notesModel");

var bodyParser = require("body-parser");

var jsonwebtoken = require("jsonwebtoken");

const mongoose = require("mongoose");

const option = {
  socketTimeoutMS: 30000,
};

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, option).then(
  function () {
    console.log("Connected to database");
  },
  function (err) {
    console.error("Error connecting to database: ", err);
  }
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET,
      function (err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

var routes = require("./api/routes/userRoute");
var noteRoutes = require("./api/routes/noteRoute");

routes(app);
noteRoutes(app);

app.use(function (req, res) {
  res.status(404).json({
    url: req.originalUrl + " not found",
  });
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
