const moment = require("moment");
const config = require("../config/config");
const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");
const { isPasswordMatch, encryptPassword } = require("../utils/password");
const jwt = require("jsonwebtoken");

const generateToken = (
  userId,
  email,
  expires,
  type,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    email,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

exports.login = catchAsync(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  const values = [req.body.email];

  executeQuery(query, values, async (error, results) => {
    console.log(results, error);
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const user = results?.[0];

    if (!user || !(await isPasswordMatch(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const tokenTime = moment().add(config.jwt.accessExpirationMinutes, "days");
    const token = generateToken(user.id, user?.email, tokenTime, user.role);

    // Remove password from the output
    delete user.password;

    res.status(200).json({
      status: "success",
      user: user,
      token: token,
    });
  });
});

exports.register = catchAsync(async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  if (role !== "student" && role !== "teacher" && role !== "admin") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid role",
    });
  }

  const query = `INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`;

  const hashPassword = await encryptPassword(password);
  const values = [first_name, last_name, email, hashPassword, role];

  executeQuery(query, values, (error, results) => {
    console.log(results, error?.message);
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: error?.message || "Internal server error",
      });
    }

    // console.log(results);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  });
});
