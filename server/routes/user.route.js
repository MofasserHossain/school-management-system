const express = require("express");
const {
  getAllUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUserCourses,
  createUserCourse,
  getUserCourse,
  updateUserCourse,
  deleteUserCourse,
  getAllUserCoursesV2,
} = require("../controllers/user");

const router = express.Router();

router.get("/course-user", getAllUserCoursesV2);
router.get("/course", getAllUserCourses);
router.post("/course", createUserCourse);
router.get("/course/:id", getUserCourse);
router.patch("/course/:id", updateUserCourse);
router.delete("/course/:id", deleteUserCourse);

router.get("/", getAllUser);
router.post("/", createUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
