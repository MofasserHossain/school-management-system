const API_BASE = "http://localhost:9000/v1"; // Replace with your actual API base URL
const userToken = localStorage.getItem("token");
const loadStudent = document.getElementById("load-student");
const viewArea = document.getElementById("view-area");

// Fetch the list of courses for a given role
async function fetchStudentCourses(role, callback) {
  try {
    const response = await fetch(`${API_BASE}/users/course-user?role=${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
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
    option.value = course.id;
    option.textContent = `${course.course_name}-${course?.batch_name}-${course.section}`;
    courseBatchSelect.appendChild(option);
  });
}

// Fetch and populate the assignment list
async function fetchAssignments(id) {
  try {
    const response = await fetch(
      `${API_BASE}/teacher/assignment?course_batch_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const data = await response.json();
    const assignments = data?.data || [];
    const tableBody = document.getElementById("assignmentList");
    tableBody.innerHTML = ""; // Clear previous rows

    assignments.forEach((assignment) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${assignment.title}</td>
        <td>${new Date(assignment.due_date).toLocaleString()}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="viewAssignment(${
            assignment.id
          })">View</button>
          <button class="btn btn-warning btn-sm" onclick="editAssignment(${
            assignment.id
          })">Edit</button>
          <button data-id="${
            assignment.id
          }" class="btn btn-danger btn-sm" onclick="deleteAssignment(${
        assignment.id
      })">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
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
  viewArea.classList.remove("d-none");
  await fetchAssignments(courseBatchId);
});

document
  .getElementById("assignmentForm")
  .addEventListener("submit", async (e) => {
    const user = JSON.parse(localStorage.getItem("user"));

    e.preventDefault();
    const assignmentId = e.target.dataset.id;
    const method = assignmentId ? "PUT" : "POST";
    const url = assignmentId
      ? `${API_BASE}/teacher/assignments/${assignmentId}`
      : `${API_BASE}/teacher/assignments`;

    const body = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      //   student_id: document.getElementById("studentSelect").value,
      course_batch_id: document.getElementById("courseBatchSelect").value,
      teacher_id: user.id,
      due_date: document.getElementById("dueDate").value,
      mark: document.getElementById("mark").value || null,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Assignment saved successfully!");
        fetchAssignments();
        document.getElementById("assignmentForm").reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  });

async function editAssignment(id) {
  try {
    const response = await fetch(`${API_BASE}/teacher/assignments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const assignment = await response.json();

    document.getElementById("editAssignmentId").value = assignment.id;
    document.getElementById("title").value = assignment.title;
    document.getElementById("description").value = assignment.description;
    // document.getElementById("studentSelect").value = assignment.student_id;
    // document.getElementById("courseBatchSelect").value =
    //   assignment.course_batch_id;
    document.getElementById("dueDate").value = assignment.due_date;
    document.getElementById("mark").value = assignment.mark;

    document.getElementById("formTitle").textContent = "Edit Assignment";
  } catch (error) {
    console.error("Error fetching assignment for editing:", error);
  }
}

async function deleteAssignment(id) {
  if (!confirm("Are you sure you want to delete this assignment?")) return;

  try {
    const response = await fetch(`${API_BASE}/teacher/assignments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Assignment deleted successfully!");
      fetchAssignments();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error deleting assignment:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!userToken) {
    alert("Please login first");
    window.location.href = "/projects/client/login.html";
    return;
  }
  // Initial load
  // Load available courses when the page loads (assuming role is 'student')
  fetchStudentCourses("student", renderCourses);
});
