const studentsList = document.getElementById("studentsList");
const tokenValue = localStorage.getItem("token");
const loadStudent = document.getElementById("load-student");
const courseBatchSelect = document.getElementById("courseBatchSelect");
const submitButton = document.getElementById("submitButton");

const getGradeFomMark = (mark) => {
  if (mark >= 80) return "A+";
  if (mark >= 75) return "A";
  if (mark >= 70) return "A-";
  if (mark >= 65) return "B";
  if (mark >= 60) return "B-";
  if (mark >= 55) return "C";
  if (mark >= 50) return "C-";
  if (mark >= 45) return "D";
  if (mark >= 40) return "D-";
  return "F";
};

const API_BASE = "http://localhost:9000/v1"; // Replace with your actual API base URL
// Fetch the list of courses for a given role
async function fetchStudentCourses(role, callback) {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(
      `${API_BASE}/users/course-user?role=${role}&id=${user?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
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
      `${API_BASE}/users/course-group/${courseBatchId}?type=grade`,
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
    option.value = course.course_batch_id;
    option.textContent = `${course.course_name}-${course?.batch_name}-${course.section}`;
    courseBatchSelect.appendChild(option);
  });
}

// Render students into the table
function renderStudents(students) {
  studentsList.innerHTML = ""; // Clear previous list
  const isALreadyGraded = students.some((student) => student.mark !== null);
  if (isALreadyGraded) {
    // alert("Grades already submitted for this course batch");
    loadStudent.setAttribute("disabled", true);
  }
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.first_name + " " + student?.last_name}</td>
      <td>${student.email}</td>
      <td>
        <input 
          type="number" 
          class="form-control" 
          name="grade_${student.user_id}" 
          value="${student?.mark || ""}"
          ${student?.mark === null ? "" : `readonly="true"`}
          placeholder="Enter grade" 
          min="0" 
          max="100" 
          required 
        />
      </td>
    `;
    studentsList.appendChild(row);
  });
  submitButton.classList.remove("disabled");
}

// Handle form submission to submit grades
async function submitGrades(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const gradesData = [];

  formData.forEach((value, key) => {
    const studentId = key.split("_")[1]; // Extract student ID
    gradesData.push({
      user_id: studentId,
      mark: Number(value),
      grade: getGradeFomMark(Number(value)),
      course_batch_id: courseBatchSelect.value,
    });
  });

  console.log("Grades data:", gradesData);

  try {
    const response = await fetch(`${API_BASE}/teacher/submit-grades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenValue}`,
      },
      body: JSON.stringify({ grades: gradesData }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      alert("Grades submitted successfully");
      window.location.reload();
    } else {
      alert("Error submitting grades");
    }
  } catch (error) {
    console.error("Error submitting grades:", error);
    alert(error?.message || "Failed to submit grades");
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

document.getElementById("gradeForm").addEventListener("submit", submitGrades);

document.addEventListener("DOMContentLoaded", async () => {
  if (!tokenValue) {
    alert("Please login first");
    window.location.href = "/projects/client/login.html";
    return;
  }
  // Load available courses when the page loads (assuming role is 'student')
  const decodeToken = atob(tokenValue.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;
  fetchStudentCourses(role, renderCourses);
});
