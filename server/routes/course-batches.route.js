const express = require("express");
const {
  createCourseBatches,
  getAllCourseBatches,
  getCourseBatches,
  deleteCourseBatches,
  updateCourseBatches,
} = require("../controllers/course-batch");

const router = express.Router();

router.get("/", getAllCourseBatches);
router.post("/", createCourseBatches);
router.get("/:id", getCourseBatches);
router.patch("/:id", updateCourseBatches);
router.delete("/:id", deleteCourseBatches);

module.exports = router;
