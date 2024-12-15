// name varchar(255) not null,

const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");

// alias varchar(20) not null,
exports.createBatch = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `INSERT INTO batches (name) VALUES (?)`;
  const values = [name];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Batch created successfully",
    });
  });
});

exports.getAllBatch = catchAsync(async (req, res) => {
  const query = `SELECT * FROM batches order by created_at desc`;

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

exports.getBatch = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide department id",
    });
  }

  const query = `SELECT * FROM batches WHERE id = ?`;
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
        message: "Batch not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateBatch = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `UPDATE batches SET name = ? WHERE id = ?`;
  const values = [name, id];

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
        message: "Batch not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Batch updated successfully",
    });
  });
});

exports.deleteBatch = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide department id",
    });
  }

  const query = `DELETE FROM batches WHERE id = ?`;
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
        message: "Batch not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Batch deleted successfully",
    });
  });
});
