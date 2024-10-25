import express from "express";
const router = express.Router();
const notesController = require("../controllers/notesController");

router.get("/notes", notesController.getAllUserNotes);
router.post("/notes/add", notesController.addNote);

export default router;
