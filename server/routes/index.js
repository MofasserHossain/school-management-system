const express = require("express");
const authRoute = require("./auth.route");
const department = require("./department.route");
const users = require("./user.route");
const batches = require("./batch.route");
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
