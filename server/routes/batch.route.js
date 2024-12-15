const express = require("express");
const {
  createBatch,
  getAllBatch,
  getBatch,
  deleteBatch,
  updateBatch,
} = require("../controllers/batch");

const router = express.Router();

router.get("/", getAllBatch);
router.post("/", createBatch);
router.get("/:id", getBatch);
router.patch("/:id", updateBatch);
router.delete("/:id", deleteBatch);

module.exports = router;
