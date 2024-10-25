import express from "express";
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/profile", userController.getUserProfile);

export default router;
