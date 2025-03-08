const express = require("express");
const router = express.Router();
const Student = require("./StudentModel");
const verifyToken = require("./middleware");
const axios = require("axios");
const mongoose = require("mongoose");

router.get("/all", verifyToken, async (req, res) => {
  try {
    const student = await Student.find();
    res.status(200).json({ student });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  const addstudent = new Student(req.body);
  try {
    const savestudent = await addstudent.save();
    res.status(200).json({ savestudent });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/enroll/:student_id/:course_id", async (req, res) => {
  const { student_id, course_id } = req.params;
  try {
    const student = await Student.findById(student_id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    const courses = await axios.get("http://localhost:3008/course/all", {
      headers: {
        Authorization: req.headers["authorization"],
      },
    });

    if (!courses.data) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (student.cours.includes(course_id)) {
      return res
        .status(400)
        .json({ message: "Student already enrolled in this course" });
    }
    student.cours.push(course_id);
    await student.save();

    res.json({ message: "Enrolled successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/enrolledCourses/:etudiant_id", verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.etudiant_id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ cours: student.cours });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
