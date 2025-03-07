const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  professeur_id: [{ type: String, ref: "teacher" }],
  description: { type: String, required: true },
  prix: { type: String, required: true },
});

module.exports = mongoose.model("course", courseSchema);
