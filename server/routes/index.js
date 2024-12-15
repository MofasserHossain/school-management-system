const express = require("express");
const authRoute = require("./auth.route");
const department = require("./department.route");
const users = require("./user.route");
const batches = require("./batch.route");
const courses = require("./course.route");
const courseBatch = require("./course-batches.route");
const students = require("./student.route");
const teachers = require("./teacher.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/department",
    route: department,
  },
  {
    path: "/users",
    route: users,
  },
  {
    path: "/batches",
    route: batches,
  },
  {
    path: "/courses",
    route: courses,
  },
  {
    path: "/course-batches",
    route: courseBatch,
  },
  {
    path: "/students",
    route: students,
  },
  {
    path: "/teacher",
    route: teachers,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
