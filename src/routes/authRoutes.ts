import express from "express";
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/auth/signup", authController.signup);

router.post("/auth/signin", authController.signin);

export default router;
