const express = require("express");
const {
  createTeacherCourse,
  getTeacherCourse,
  getAllTeacherCourses,
  deleteTeacherCourse,
  updateTeacherCourse,
} = require("../controllers/teacher");

const router = express.Router();

// router.get("/course", getAllTeacherCourses);
// router.post("/course", createTeacherCourse);
// router.get("/course/:id", getTeacherCourse);
// router.patch("/course/:id", updateTeacherCourse);
// router.delete("/course/:id", deleteTeacherCourse);

module.exports = router;
