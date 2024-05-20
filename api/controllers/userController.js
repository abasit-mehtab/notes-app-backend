var dotenv = require("dotenv");
dotenv.config();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = mongoose.model("User");

exports.registerUser = async function (req, res) {
  try {
    var newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);

    const user = await newUser.save();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not created",
      });
    }

    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.loginUser = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({
        success: false,
        message: "Authentication Failed! Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully!",
      data: {
        token: jwt.sign(
          { email: user.email, fullName: user.fullName, _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        ),
      },
    });
  } catch (error) {
    throw err;
  }
};

exports.loginRequired = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error,
    });
  }
};

exports.getProfile = function (req, res) {
  exports.loginRequired(req, res, async function () {
    try {
      const userObj = { ...req.user.toObject() };
      delete userObj.password;
      res.status(200).json({
        success: true,
        data: userObj,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal Server Error: ${error}`,
      });
    }
  });
};
