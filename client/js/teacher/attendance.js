const studentsList = document.getElementById("studentsList");
const tokenValue = localStorage.getItem("token");
const loadStudent = document.getElementById("load-student");
const courseBatchSelect = document.getElementById("courseBatchSelect");

const API_BASE = "http://localhost:9000/v1"; // Replace with your actual API base URL
// Fetch the list of courses for a given role
async function fetchStudentCourses(role, callback) {
  try {
    const response = await fetch(`${API_BASE}/users/course-user?role=${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenValue}`,
      },
    });
    const data = await response.json();
    const courses = data?.data; // Assuming the response has 'data' property with courses
    callback(courses);
  } catch (error) {
    console.error("Error fetching student courses", error);
  }
}

// Fetch the students for a selected course batch
async function fetchStudentsByCourseBatch(courseBatchId, callback) {
  try {
    const response = await fetch(
      `${API_BASE}/users/course-group/${courseBatchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
    const data = await response.json();
    const students = data?.data; // Assuming the response has 'data' property with students
    callback(students);
  } catch (error) {
    console.error("Error fetching students for course batch", error);
  }
}

// Render courses into the select dropdown
function renderCourses(courses) {
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = `${course.course_name}-${course?.batch_name}-${course.section}`;
    courseBatchSelect.appendChild(option);
  });
}

// Render students into the table
function renderStudents(students) {
  studentsList.innerHTML = ""; // Clear previous list
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.first_name + " " + student?.last_name}</td>
      <td>${student.email}</td>
      <td>
        <input type="radio" name="attendance_${
          student.user_id
        }" value="present"> Yes
        <input type="radio" name="attendance_${
          student.user_id
        }" value="absent"> No
      </td>
    `;
    studentsList.appendChild(row);
  });
}

// Handle form submission to submit attendance
async function submitAttendance(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const attendanceData = [];

  formData.forEach((value, key) => {
    const studentId = key.split("_")[1];
    attendanceData.push({
      user_id: studentId,
      status: value,
      course_batch_id: courseBatchSelect.value,
      date: new Date().toISOString()?.split("T")[0],
    });
  });

  console.log("Attendance data", attendanceData);
  try {
    const response = await fetch(`${API_BASE}/teacher/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenValue}`,
      },
      body: JSON.stringify({ datas: attendanceData }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Attendance submitted successfully");
      if (data.success) {
        alert("Attendance submitted successfully");
      } else {
        alert("Error submitting attendance");
      }
    } else {
      alert("Error submitting attendance");
    }
    // console.log("Attendance response", data);
    // if (data.success) {
    //   alert("Attendance submitted successfully");
    // } else {
    //   alert("Error submitting attendance");
    // }
  } catch (error) {
    console.error("Error submitting attendance", error);
    alert(error?.message || "Failed to submit attendance");
  }
}

// // Event listeners
loadStudent.addEventListener("click", async () => {
  const courseBatchId = courseBatchSelect.value;
  if (!courseBatchId) {
    alert("Please select a course batch.");
    return;
  }
  // Fetch and display students based on selected course batch
  await fetchStudentsByCourseBatch(courseBatchId, renderStudents);
});

document
  .getElementById("attendanceForm")
  .addEventListener("submit", submitAttendance);

document.addEventListener("DOMContentLoaded", async () => {
  if (!tokenValue) {
    alert("Please login first");
    window.location.href = "/projects/client/login.html";
    return;
  }
  // Load available courses when the page loads (assuming role is 'student')
  fetchStudentCourses("student", renderCourses);
});
