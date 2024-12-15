const express = require("express");
const {
  createDepartment,
  getAllDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
} = require("../controllers/department");

const router = express.Router();

router.get("/", getAllDepartment);
router.post("/", createDepartment);
router.get("/:id", getDepartment);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
