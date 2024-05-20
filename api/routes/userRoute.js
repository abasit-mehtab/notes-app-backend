module.exports = function (app) {
  var userHandlers = require("../controllers/userController");

  app.route("/api/profile").get(userHandlers.getProfile);
  app.route("/api/auth/register").post(userHandlers.registerUser);
  app.route("/api/auth/login").post(userHandlers.loginUser);
};
