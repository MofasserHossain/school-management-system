const express = require("express");
const {
  getAllUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const router = express.Router();

router.get("/", getAllUser);
router.post("/", createUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
