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
  const { role } = req.query;
  const query = `SELECT * FROM users where role != 'admin' ${
    role ? `AND role = '${role}'` : ""
  } order by created_at desc`;

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

// Create Student-Course
exports.createUserCourse = catchAsync(async (req, res) => {
  const { user_id, course_batch_id, type } = req.body;

  if (!user_id || !course_batch_id || !type) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing required fields" });
  }

  const query = `INSERT INTO user_courses (user_id, course_batch_id, type) VALUES (?, ?, ?)`;
  executeQuery(query, [user_id, course_batch_id, type], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    res
      .status(201)
      .json({ status: "success", message: "Student-Course created" });
  });
});

// Get All User-Courses
exports.getAllUserCourses = catchAsync(async (req, res) => {
  const { type } = req.query;
  console.log({ type });
  const query = `
      SELECT 
        sc.id,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name,
        u.role AS user_role,
        u.email AS student_email,
        cb.term,
        cb.year,
        cb.section,
        c.name
      FROM user_courses as sc
      JOIN users as u ON sc.user_id = u.id
      JOIN course_batches as cb ON sc.course_batch_id = cb.id
      JOIN courses as c ON cb.course_id = c.id
      ${type ? `WHERE sc.type = '${type}'` : ""}
        `;

  executeQuery(query, [], (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
    console.log(results);
    res.status(200).json({
      status: "success",
      data: results,
    });
  });
});

exports.getAllUserCoursesV2 = catchAsync(async (req, res) => {
  const { type } = req.query;
  // console.log({ type });
  const query = `
      SELECT
          uc.id,
          c.name AS course_name,
          c.credits AS course_credits,
          cb.term AS semester,
          cb.section AS section,
          b.name AS batch_name,
          d.alias AS department_name
      FROM 
          user_courses as uc
      JOIN 
          course_batches as cb ON uc.course_batch_id = cb.id
      JOIN 
          courses as c ON cb.course_id = c.id
      JOIN 
          batches as b ON cb.batch_id = b.id
      JOIN 
          departments as d ON c.department_id = d.id
      ${type ? `WHERE uc.type = '${type}'` : ""}
              `;

  executeQuery(query, [], (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
    console.log(results);
    res.status(200).json({
      status: "success",
      data: results,
    });
  });
});

// Get Single User-Course
exports.getUserCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM user_courses WHERE id = ?`;

  executeQuery(query, [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    if (!result.length)
      return res.status(404).json({ status: "fail", message: "Not found" });
    res.status(200).json({
      status: "success",
      data: result?.[0],
    });
  });
});

// Update User-Course
exports.updateUserCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { user_id, course_batch_id } = req.body;

  if (!user_id || !course_batch_id) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing required fields" });
  }

  const query = `UPDATE user_courses SET user_id = ?, course_batch_id = ? WHERE id = ?`;
  executeQuery(query, [user_id, course_batch_id, id], (err) => {
    if (err)
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    res.status(200).json({ status: "success", message: "User-Course updated" });
  });
});

// Delete User-Course
exports.deleteUserCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM user_courses WHERE id = ?`;

  executeQuery(query, [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ status: "fail", message: "Not found" });
    res.status(200).json({ status: "success", message: "User-Course deleted" });
  });
});

exports.getAllUserByCourseBatch = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT 
    uc.user_id as user_id,
    u.first_name as first_name,
    u.last_name as last_name,
    u.email as email,
    u.role as role,
    uc.type as type,
    uc.created_at as created_at
   FROM user_courses as uc
    JOIN users as u ON uc.user_id = u.id
    WHERE uc.course_batch_id = ? and uc.type = 'student' order by created_at desc;
  `;

  executeQuery(query, [id], (err, results) => {
    console.log(err, results);
    if (err)
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    res.status(200).json({
      status: "success",
      data: results,
    });
  });
});
