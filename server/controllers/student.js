const { executeQuery } = require("../config/db-function");
const catchAsync = require("../utils/cacheAsync");

exports.getStudentAssignment = catchAsync(async (req, res) => {
  const { course_batch_id } = req.query;
  const query = `SELECT 
    a.id as id,
    a.title as title,
    a.description as description,
    a.due_date as due_date,
    a.mark as mark,
    s.link as link,
    s.is_late as late
  FROM assignments as a left join submissions as s on a.id = s.assignment_id where a.course_batch_id = ? order by a.created_at desc`;

  executeQuery(query, [course_batch_id], (error, results) => {
    console.log("error", error);
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

exports.submitStudentAssignment = catchAsync(async (req, res) => {
  const { student_id, assignment_id, link, course_batch_id, isLate } = req.body;

  if (!student_id || !assignment_id || !link || !course_batch_id) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  console.log("student_id", req.body);

  const query = `INSERT INTO submissions (student_id, assignment_id, course_batch_id, link, is_late)
    VALUES (?, ?, ?, ?, ?)`;
  const values = [student_id, assignment_id, course_batch_id, link, isLate];

  executeQuery(query, values, (error, results) => {
    console.log(`\n\n ~ executeQuery ~ error:`, error);
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

exports.getStudentResults = catchAsync(async (req, res) => {
  const id = req.params?.studentId;
  const query = `SELECT 
    g.id as id,
    g.mark as mark,
    g.grade as grade,
    cb.course_id as course_id,
    cb.batch_id as batch_id,
    cb.id as course_batch_id,
    g.created_at as created_at,
    cb.term as term,
    cb.section as section,
    cb.year as year,
    c.name as course_name,
    c.credits as credits
  FROM grades as g
  JOIN course_batches as cb ON g.course_batch_id = cb.id
  left JOIN courses as c ON cb.course_id = c.id
  where g.student_id = ? order by created_at desc`;

  executeQuery(query, [id], (error, results) => {
    console.log("error", error);
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
