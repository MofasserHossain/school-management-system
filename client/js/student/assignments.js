const API_BASE = "http://localhost:9000/v1"; // Replace with your actual API base URL
const userToken = localStorage.getItem("token");
const loadStudent = document.getElementById("load-student");
const viewArea = document.getElementById("view-area");
const cancelBtn = document.getElementById("cancelBtn");
const submitAssignment = document.getElementById("submitAssignment");
const details = document.getElementById("details");
// Fetch the list of courses for a given role
let assignments = [];
async function fetchStudentCourses(role, callback) {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(
      `${API_BASE}/users/course-user?role=${role}&id=${user?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
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

// Render courses into the select dropdown
function renderCourses(courses) {
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.course_batch_id;
    option.textContent = `${course.course_name}-${course?.batch_name}-${course.section}`;
    courseBatchSelect.appendChild(option);
  });
}

// Fetch and populate the assignment list
async function fetchAssignments(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(
      `${API_BASE}/student/assignment?course_batch_id=${id}&student_id=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const data = await response.json();
    assignments = data?.data || [];
    console.log("assignments", assignments);
    renderAssignments(data?.data || []);
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
}

function renderAssignments(assignments) {
  const tableBody = document.getElementById("assignmentList");
  tableBody.innerHTML = ""; // Clear previous rows
  assignments.forEach((assignment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${assignment.title}</td>
      <td>${assignment.description}</td>
      <td>${assignment.mark || "N/A"}</td>
      <td>${new Date(assignment.due_date).toLocaleString()}</td>
      <td style="color: ${
        assignment?.link && !assignment?.late ? "green" : "red"
      }">
        ${
          assignment?.link
            ? `<a href="${assignment.link}" target="_blank" 
              style="color: ${assignment.late ? "red" : "green"}"
            >Submitted</a>`
            : "Not Submitted"
        }
      </td>
      <td>
        ${
          assignment?.link
            ? ""
            : `<button class="btn btn-primary" onclick="loadAssignmentForm(${assignment.id},
            '${assignment.title}', '${assignment.description}', '${assignment.due_date}'
            )">Submit</button>`
        }
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Load the form with the selected assignment ID
function loadAssignmentForm(assignmentId, title, description, due_date) {
  details.innerHTML = `
    <h4 class="mb-3"
    ><strong>Title</strong>: ${title}</h4>
    <p><strong>Description</strong>: ${description}</p>
    <p><strong>Due Date</strong>: ${new Date(due_date).toLocaleString()}</p>
  `;
  document.getElementById("assignmentId").value = assignmentId;
  document.getElementById("courseBatchId").value =
    document.getElementById("courseBatchSelect").value;
  document.getElementById("formTitle").textContent = "Submit Assignment";
  submitAssignment.removeAttribute("disabled");
}

const assignmentForm = document.getElementById("assignmentForm");

assignmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const assignmentId = document.getElementById("assignmentId").value;
  const submissionLink = document.getElementById("submissionLink").value;
  const user = JSON.parse(localStorage.getItem("user"));

  const findAssignment = assignments.find(
    (assignment) => assignment.id === parseInt(assignmentId)
  );

  const isLate = new Date(findAssignment.due_date) < new Date();
  console.log(
    `\n\n ~ assignmentForm.addEventListener ~ findAssignment:`,
    findAssignment
  );
  const courseBatchId = courseBatchSelect.value;
  if (!assignmentId || !courseBatchId || !submissionLink) {
    alert("Please provide all required fields.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/student/submit-assignment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        assignment_id: assignmentId,
        student_id: user.id,
        course_batch_id: courseBatchId,
        link: submissionLink,
        isLate,
      }),
    });
    const data = await response.json();
    if (response.ok && data.status === "success") {
      alert("Assignment submitted successfully!");
      assignmentForm.reset();
      document.getElementById("assignmentId").value = assignmentId;
      document.getElementById("formTitle").textContent = "Submit Assignment";
      submitAssignment.setAttribute("disabled", "disabled");
      fetchAssignments(courseBatchId); // Refresh assignment list
    } else {
      console.error("Failed to submit assignment:", data);
      alert(data.message || "Failed to submit assignment.");
    }
  } catch (error) {
    console.error("Error submitting assignment:", error);
    alert("Error submitting assignment. Please try again.");
  }
});

// // Event listeners
loadStudent.addEventListener("click", async () => {
  const courseBatchId = courseBatchSelect.value;
  if (!courseBatchId) {
    alert("Please select a course batch.");
    return;
  }
  // Fetch and display students based on selected course batch
  viewArea.classList.remove("d-none");
  await fetchAssignments(courseBatchId);
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!userToken) {
    alert("Please login first");
    window.location.href = "/projects/client/login.html";
    return;
  }
  // Initial load
  // Load available courses when the page loads (assuming role is 'student')
  const decodeToken = atob(userToken.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;
  fetchStudentCourses(role, renderCourses);
});
