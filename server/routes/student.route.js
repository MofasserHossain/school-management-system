const express = require("express");
const {
  createStudentCourse,
  getStudentCourse,
  getAllStudentCourses,
  deleteStudentCourse,
  updateStudentCourse,
} = require("../controllers/student");

const router = express.Router();

// router.get("/course", getAllStudentCourses);
// router.post("/course", createStudentCourse);
// router.get("/course/:id", getStudentCourse);
// router.patch("/course/:id", updateStudentCourse);
// router.delete("/course/:id", deleteStudentCourse);

module.exports = router;
