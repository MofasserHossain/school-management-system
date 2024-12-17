const express = require("express");
const {
  getStudentAssignment,
  submitStudentAssignment,
  getStudentResults,
} = require("../controllers/student");

const router = express.Router();

router.post("/submit-assignment", submitStudentAssignment);
router.get("/assignment", getStudentAssignment);

router.get("/grades/:studentId", getStudentResults);

module.exports = router;
