// name varchar(255) not null,

const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");

// alias varchar(20) not null,
exports.createDepartment = catchAsync(async (req, res) => {
  const { name, alias } = req.body;
  if (!name || !alias) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `INSERT INTO departments (name , alias) VALUES (?, ?)`;
  const values = [name, alias];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Department created successfully",
    });
  });
});

exports.getAllDepartment = catchAsync(async (req, res) => {
  const query = `SELECT * FROM departments order by created_at desc`;

  executeQuery(query, [], (error, results) => {
    console.log(results, error?.message);
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

exports.getDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide department id",
    });
  }

  const query = `SELECT * FROM departments WHERE id = ?`;
  const values = [id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, alias } = req.body;
  if (!id || !name || !alias) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `UPDATE departments SET name = ?, alias = ? WHERE id = ?`;
  const values = [name, alias, id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Department updated successfully",
    });
  });
});

exports.deleteDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide department id",
    });
  }

  const query = `DELETE FROM departments WHERE id = ?`;
  const values = [id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Department deleted successfully",
    });
  });
});
