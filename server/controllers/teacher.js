const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");

exports.getAllTeacherAttendances = catchAsync(async (req, res) => {
  const query = `SELECT * FROM teacher_attendance order by created_at desc`;

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

exports.createTeacherAttendance = catchAsync(async (req, res) => {
  //   const { user_id, course_batch_id, date, status } = req.body;
  const { datas } = req.body;

  if (datas.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const checkAllKey = datas.every((data) => {
    return (
      data.hasOwnProperty("user_id") &&
      data.hasOwnProperty("course_batch_id") &&
      data.hasOwnProperty("date") &&
      data.hasOwnProperty("status")
    );
  });

  if (!checkAllKey) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `INSERT INTO attendance (user_id, course_batch_id, date, status, message)
VALUES ?`;
  const values = [
    datas.map((data) => [
      data.user_id,
      data.course_batch_id,
      data.date,
      data.status,
      data.message,
    ]),
  ];

  executeQuery(query, values, (error, results) => {
    console.log("error", error);
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: error?.message || "Internal server error",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Attendance records created successfully",
      affectedRows: results.affectedRows, // Check how many rows were inserted
    });
  });
});

exports.getTeacherAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM teacher_attendance WHERE id = ?`;

  executeQuery(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Teacher attendance not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateTeacherAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { user_id, course_batch_id, date, status } = req.body;
  if (!user_id || !course_batch_id || !date || !status) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `UPDATE teacher_attendance SET user_id = ?, course_batch_id = ?, date = ?, status = ?
WHERE id = ?`;
  const values = [user_id, course_batch_id, date, status, id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Teacher attendance updated successfully",
    });
  });
});

exports.deleteTeacherAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM teacher_attendance WHERE id = ?`;

  executeQuery(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Teacher attendance deleted successfully",
    });
  });
});

exports.getAllTeacherAssignments = catchAsync(async (req, res) => {
  const { course_batch_id } = req.query;
  const query = `SELECT * FROM assignments where course_batch_id= ? order by created_at desc`;

  executeQuery(query, [course_batch_id], (error, results) => {
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

exports.createTeacherAssignment = catchAsync(async (req, res) => {
  const { course_batch_id, description, due_date, mark, teacher_id, title } =
    req.body;

  if (
    !course_batch_id ||
    !description ||
    !due_date ||
    !mark ||
    !teacher_id ||
    !title
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query =
    "SELECT * FROM user_courses where course_batch_id = ? and type = 'student'";

  executeQuery(query, [course_batch_id], (error, results) => {
    console.log("error", error);
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
    // console.log("results", results);

    const payload = results?.map((result) => {
      return {
        user_id: result.user_id,
        course_batch_id: course_batch_id,
        date: due_date,
        description: description,
        due_date: due_date,
        mark: mark,
        teacher_id: teacher_id,
        title: title,
      };
    });

    const query = `INSERT INTO assignments (student_id, course_batch_id, description, due_date, mark, teacher_id, title)
    VALUES ?`;
    const values = payload.map((data) => [
      data.user_id,
      data.course_batch_id * 1,
      data.description,
      data.due_date,
      data.mark,
      data.teacher_id,
      data.title,
    ]);
    // console.log("values", values);
    executeQuery(query, [values], (error, results) => {
      console.log("error", error);
      if (error) {
        return res.status(500).json({
          status: "fail",
          message: error?.message || "Internal server error",
        });
      }
      res.status(201).json({
        status: "success",
        message: "Assignment records created successfully",
        affectedRows: results.affectedRows, // Check how many rows were inserted
      });
    });
  });
});

exports.getTeacherAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM assignments WHERE id = ?`;

  executeQuery(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Teacher assignment not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
});

exports.updateTeacherAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { user_id, course_batch_id, date, status } = req.body;
  if (!user_id || !course_batch_id || !date || !status) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  const query = `UPDATE assignments SET user_id = ?, course_batch_id = ?, date = ?, status = ?
  WHERE id = ?`;
  const values = [user_id, course_batch_id, date, status, id];

  executeQuery(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Teacher assignment updated successfully",
    });
  });
});

exports.deleteTeacherAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM assignments WHERE id = ?`;

  executeQuery(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "fail",
        message: "Internal server error",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Teacher assignment deleted successfully",
    });
  });
});
