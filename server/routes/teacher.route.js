const express = require("express");
const {
  getAllTeacherAttendances,
  createTeacherAttendance,
  getTeacherAttendance,
  updateTeacherAttendance,
  deleteTeacherAttendance,
  getAllTeacherAssignments,
  createTeacherAssignment,
  getTeacherAssignment,
  updateTeacherAssignment,
  deleteTeacherAssignment,
  publishGrade,
  getSubmissions,
} = require("../controllers/teacher");

const router = express.Router();

router.get("/attendance", getAllTeacherAttendances);
router.post("/attendance", createTeacherAttendance);
router.get("/attendance/:id", getTeacherAttendance);
router.patch("/attendance/:id", updateTeacherAttendance);
router.delete("/attendance/:id", deleteTeacherAttendance);

router.get("/assignment", getAllTeacherAssignments);
router.post("/assignment", createTeacherAssignment);
router.get("/assignment/:id", getTeacherAssignment);
router.patch("/assignment/:id", updateTeacherAssignment);
router.delete("/assignment/:id", deleteTeacherAssignment);

router.get("/submissions/:assignmentId", getSubmissions);

router.post("/submit-grades", publishGrade);

module.exports = router;
