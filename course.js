const express = require("express");
const router = express.Router();
const Course = require("./CourseModel");
const verifyToken = require("./middleware");

router.get("/all", verifyToken, async (req, res) => {
  try {
    const course = await Course.find();
    res.status(200).json({ course });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  const addcourse = new Course(req.body);
  try {
    const savecourse = await addcourse.save();
    res.status(200).json({ savecourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const updatecourse = await Course.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatecourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Course.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/search/:title", verifyToken, async (req, res) => {
  try {
    const course = await Course.findOne({ title: req.params.title }, req.body, {
      new: true,
    });
    res.status(200).json({ course });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
