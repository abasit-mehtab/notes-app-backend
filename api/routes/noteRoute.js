module.exports = function (app) {
  var noteHandlers = require("../controllers/notesController");
  app.route("/api/notes/add").post(noteHandlers.createNote);
  app.route("/api/notes/getAll").get(noteHandlers.getAllNotes);
  app.route("/api/notes/getSingle/:id").get(noteHandlers.getSingleNote);
  app.route("/api/notes/delete/:id").delete(noteHandlers.deleteNote);
  app.route("/api/notes/update/:id").put(noteHandlers.updateNote);
};
