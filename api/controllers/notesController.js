var dotenv = require("dotenv");
dotenv.config();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var User = mongoose.model("User");
var Note = mongoose.model("Note");
const { loginRequired } = require("./userController");

exports.createNote = async function (req, res) {
  try {
    loginRequired(req, res, async function () {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id;

      const newNote = new Note({
        title: req.body.title,
        content: req.body.content,
        createdBy: userId,
      });

      const note = await newNote.save();

      if (!note) {
        return res.status(400).json({
          success: false,
          message: "Note Not Created",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Note Created Successfully",
        data: note,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.getAllNotes = async function (req, res) {
  try {
    loginRequired(req, res, async function () {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id;

      const notes = await Note.find({ createdBy: userId });

      if (!notes) {
        return res.status(404).json({
          success: false,
          message: "No Notes Found",
        });
      }

      return res.status(200).json({
        success: true,
        data: notes,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.getSingleNote = async function (req, res) {
  try {
    loginRequired(req, res, async function () {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id;

      const noteId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Note Id",
        });
      }

      const note = await Note.findOne({
        createdBy: userId,
        _id: noteId,
      });

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "No Note Found",
        });
      }

      return res.status(200).json({
        success: true,
        data: note,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};
