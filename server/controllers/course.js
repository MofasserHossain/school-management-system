const { executeQuery } = require("../config/db-function");

exports.createCourse = catchAsync(async (req, res) => {
  // name varchar(255) not null,
  // credits int not null,
  // department_id int not null,
  const { name, credits, department_id } = req.body;
  if (!name || !credits || !department_id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `INSERT INTO courses (name, credits, department_id) VALUES (?, ?, ?)`;
  const values = [name, credits, department_id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Course created successfully",
    });
  });
});

exports.getAllCourse = catchAsync(async (req, res) => {
  const query = `SELECT * FROM courses`;

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

exports.getCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide course id",
    });
  }

  const query = `SELECT * FROM courses WHERE id = ?`;
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
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, credits, department_id } = req.body;
  if (!id || !name || !credits || !department_id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `UPDATE courses SET name = ?, credits = ?, department_id = ? WHERE id = ?`;
  const values = [name, credits, department_id, id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course updated successfully",
    });
  });
});

exports.deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide course id",
    });
  }

  const query = `DELETE FROM courses WHERE id = ?`;
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
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course deleted successfully",
    });
  });
});
