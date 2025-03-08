const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cours: [{ type: String, ref: "course" }],
});

module.exports = mongoose.model("student", studentSchema);
