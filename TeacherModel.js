const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  bio: { type: String, required: true },
  cours: [{ type: String, ref: "course" }],
});

module.exports = mongoose.model("teacher", teacherSchema);
