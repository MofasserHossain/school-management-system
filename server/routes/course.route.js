const express = require("express");
const {
  createCourse,
  getAllCourse,
  getCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/course");

const router = express.Router();

router.get("/", getAllCourse);
router.post("/", createCourse);
router.get("/:id", getCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
