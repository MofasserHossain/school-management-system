const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");

exports.createCourseBatches = catchAsync(async (req, res) => {
  const { term, year, section, department_id, course_id, batch_id } = req.body;

  if (!term || !year || !section || !department_id || !course_id || !batch_id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `INSERT INTO course_batches (term, year, section, department_id, course_id, batch_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [term, year, section, department_id, course_id, batch_id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Course batch created successfully",
    });
  });
});

exports.getAllCourseBatches = catchAsync(async (req, res) => {
  const query = `
    SELECT 
      cb.id AS id, 
      cb.term AS term, 
      cb.year AS year, 
      cb.section AS section, 
      d.name AS department_name, 
      d.alias AS department_alias, 
      c.name AS course_name, 
      b.name AS batch_name, 
      cb.created_at AS created_at, 
      cb.updated_at AS updated_at
    FROM course_batches cb
    JOIN departments d ON cb.department_id = d.id
    JOIN courses c ON cb.course_id = c.id
    JOIN batches b ON cb.batch_id = b.id
    ORDER BY cb.created_at DESC;
  `;

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

exports.getCourseBatches = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide course batch id",
    });
  }

  const query = `SELECT * FROM course_batches WHERE id = ?`;
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
        message: "Course batch not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateCourseBatches = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { term, year, section, department_id, course_id, batch_id } = req.body;

  if (
    !id ||
    !term ||
    !year ||
    !section ||
    !department_id ||
    !course_id ||
    !batch_id
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `
    UPDATE course_batches 
    SET term = ?, year = ?, section = ?, department_id = ?, course_id = ?, batch_id = ?
    WHERE id = ?
  `;
  const values = [term, year, section, department_id, course_id, batch_id, id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course batch updated successfully",
    });
  });
});

exports.deleteCourseBatches = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide course batch id",
    });
  }

  const query = `DELETE FROM course_batches WHERE id = ?`;
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
        message: "Course batch not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course batch deleted successfully",
    });
  });
});
