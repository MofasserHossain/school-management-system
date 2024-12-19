const API_BASE = "http://localhost:9000/v1"; // Replace with your actual API base URL
const userToken = localStorage.getItem("token");
const loadStudent = document.getElementById("load-student");
const viewArea = document.getElementById("view-area");
const title = document.getElementById("title");
const description = document.getElementById("description");
const courseBatchSelect = document.getElementById("courseBatchSelect");
const dueDate = document.getElementById("dueDate");
const mark = document.getElementById("mark");
const form = document.getElementById("assignmentForm");
const cancelBtn = document.getElementById("cancelBtn");

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
        <td>${assignment.description}</td>
        <td>${assignment.mark || "N/A"}</td>
        <td>${new Date(assignment.due_date).toLocaleString()}</td>
        <td>
          <button
           id="viewBtn${assignment.id}"
          class="btn btn-info btn-sm" onclick="viewAssignment(${
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

form.addEventListener("submit", async (e) => {
  const user = JSON.parse(localStorage.getItem("user"));
  e.preventDefault();
  const assignmentId = e.target.dataset.id;
  const method = assignmentId ? "PUT" : "POST";
  const url = assignmentId
    ? `${API_BASE}/teacher/assignment/${assignmentId}`
    : `${API_BASE}/teacher/assignment`;

  const body = {
    title: title.value,
    description: description.value,
    //   student_id: document.getElementById("studentSelect").value,
    course_batch_id: courseBatchSelect.value,
    teacher_id: user.id,
    due_date: dueDate.value,
    mark: mark.value || null,
  };

  console.log("Assignment data", body);

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
      // alert("Assignment saved successfully!");
      const courseBatchId = courseBatchSelect.value;
      fetchAssignments(courseBatchId);
      form.reset();
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
    const response = await fetch(`${API_BASE}/teacher/assignment/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();

    const assignment = res.data;

    document.getElementById("editAssignmentId").value = assignment.id;
    title.value = assignment.title;
    description.value = assignment.description;
    // document.getElementById("studentSelect").value = assignment.student_id;
    // document.getElementById("courseBatchSelect").value =
    //   assignment.course_batch_id;
    dueDate.value = new Date(assignment?.due_date).toISOString().slice(0, 16);
    mark.value = assignment.mark;
    document.getElementById("formTitle").textContent = "Edit Assignment";
  } catch (error) {
    console.error("Error fetching assignment for editing:", error);
  }
}

cancelBtn.addEventListener("click", () => {
  form.reset();
  document.getElementById("formTitle").textContent = "Create Assignment";
});

async function deleteAssignment(id) {
  if (!confirm("Are you sure you want to delete this assignment?")) return;

  try {
    const response = await fetch(`${API_BASE}/teacher/assignment/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      // alert("Assignment deleted successfully!");
      const courseBatchId = courseBatchSelect.value;
      fetchAssignments(courseBatchId);
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error deleting assignment:", error);
  }
}

// view assignment
async function fetchSubmissions(assignmentId) {
  try {
    const response = await fetch(
      `${API_BASE}/teacher/submissions/${assignmentId}?course_batch_id=${courseBatchSelect.value}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch submissions.");

    const data = await response.json();
    return data?.data || []; // Return submissions array
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
}

// View Assignment: Open modal and show submissions
async function viewAssignment(assignmentId) {
  const buttonId = document.getElementById(`viewBtn${assignmentId}`);
  try {
    buttonId.setAttribute("disabled", "disabled");
    // Fetch submissions
    const submissions = await fetchSubmissions(assignmentId);

    // Get modal table body
    const submissionTableBody = document.getElementById("submissionTableBody");

    // Clear previous table rows
    submissionTableBody.innerHTML = "";

    // Populate the table with submission data
    if (submissions.length === 0) {
      submissionTableBody.innerHTML =
        "<tr><td colspan='5' class='text-center'>No submissions found</td></tr>";
    } else {
      submissions.forEach((submission) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${submission.first_name + " " + submission?.last_name}</td>
        <td>${submission.email}</td>
        <td><a href="${
          submission.link
        }" target="_blank">View Submission</a></td>
          <td>${new Date(submission.submission_date).toLocaleString()}</td>
          <td>${submission?.is_late ? "Yes" : "No"}</td>
          `;
        submissionTableBody.appendChild(row);
      });
    }

    // Show the modal
    const submissionModal = new bootstrap.Modal(
      document.getElementById("submissionModal")
    );
    submissionModal.show();
  } catch (error) {
    console.error("Error viewing assignment:", error);
  } finally {
    buttonId.removeAttribute("disabled");
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
  const decodeToken = atob(userToken.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;
  fetchStudentCourses(role, renderCourses);
});
