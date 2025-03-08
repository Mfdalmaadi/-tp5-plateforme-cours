const express = require("express");
const router = express.Router();
const Teacher = require("./TeacherModel");
const verifyToken = require("./middleware");
const axios = require("axios");
const mongoose = require("mongoose");

router.get("/all", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.find();
    res.status(200).json({ teacher });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  const addteacher = new Teacher(req.body);
  try {
    const saveteacher = await addteacher.save();
    res.status(200).json({ saveteacher });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/assign/:professeur_id/:course_id", async (req, res) => {
  const { professeur_id, course_id } = req.params;
  const token = req.headers["authorization"];
  try {
    const teacher = await Teacher.findById(professeur_id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const courses = await axios.get("http://localhost:3008/course/all", {
      headers: {
        Authorization: token,
      },
    });

    if (!courses.data) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (teacher.cours.includes(course_id)) {
      return res
        .status(400)
        .json({ message: "Teacher already assigned to this course" });
    }
    teacher.cours.push(course_id);
    await teacher.save();

    const course = courses.data;
    course.professeur_id.push(professeur_id);
    await axios.put(`http://localhost:3008/course/${course_id}`, course, {
      headers: { Authorization: token },
    });

    res.json({ message: "Assigned successfully", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/enrolledStudents/:course_id", async (req, res) => {
  const { course_id } = req.params;
  const token = req.headers["authorization"];
  try {
    const students = await axios.get("http://localhost:3007/student/all", {
      headers: {
        Authorization: token,
      },
    });
    const enrolledStudents = [];
    students.data.student.forEach((s) => {
      if (s.cours.includes(course_id)) {
        enrolledStudents.push(s);
      }
    });
    res.json(enrolledStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
