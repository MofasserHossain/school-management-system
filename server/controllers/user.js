const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");
const { encryptPassword } = require("../utils/password");

exports.createUser = catchAsync(async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  if (role !== "student" && role !== "teacher") {
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

exports.getAllUser = catchAsync(async (req, res) => {
  const query = `SELECT * FROM users where role != 'admin' order by created_at desc`;

  executeQuery(query, [], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      data: results,
    });
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide user id",
    });
  }

  const query = `SELECT * FROM users WHERE id = ?`;
  const values = [id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, role } = req.body;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide user id",
    });
  }

  const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?`;
  const values = [first_name, last_name, email, role, id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide user id",
    });
  }

  const query = `DELETE FROM users WHERE id = ?`;
  const values = [id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  });
});
