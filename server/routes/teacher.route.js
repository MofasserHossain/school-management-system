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
} = require("../controllers/teacher");

const router = express.Router();

router.get("/attendance", getAllTeacherAttendances);
router.post("/attendance", createTeacherAttendance);
router.get("/attendance/:id", getTeacherAttendance);
router.patch("/attendance/:id", updateTeacherAttendance);
router.delete("/attendance/:id", deleteTeacherAttendance);

router.get("/assignments", getAllTeacherAssignments);
router.post("/assignments", createTeacherAssignment);
router.get("/assignments/:id", getTeacherAssignment);
router.patch("/assignments/:id", updateTeacherAssignment);
router.delete("/assignments/:id", deleteTeacherAssignment);

module.exports = router;
