const courseTableBody = document.querySelector("#courseTable tbody");
const courseNameInput = document.getElementById("courseName");
const courseCreditsInput = document.getElementById("courseCredits");
const departmentSelect = document.getElementById("departmentSelect");
const courseSubmitBtn = document.getElementById("courseSubmitBtn");
const editCourseIdInput = document.getElementById("editCourseId");
const tokeVal = localStorage.getItem("token");
const hiddenButton = document.getElementById("batchCancelBtn");

// API Base URLs
const courseApiUrl = "http://localhost:9000/v1/courses";
const departmentApiUrl = "http://localhost:9000/v1/department";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/projects/client";
});

// Fetch Courses and Render Table
async function fetchCourses() {
  try {
    const response = await fetch(courseApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const courses = data.data;
      renderCourseTable(courses);
    } else {
      console.error("Failed to fetch courses", response.status);
    }
  } catch (error) {
    console.error("Error fetching courses", error);
  }
}

// Fetch Departments and Populate Dropdown
async function fetchDepartments() {
  try {
    const response = await fetch(departmentApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const departments = data.data;
      renderDepartmentDropdown(departments);
    } else {
      console.error("Failed to fetch departments", response.status);
    }
  } catch (error) {
    console.error("Error fetching departments", error);
  }
}

// Render Course Table
function renderCourseTable(courses) {
  courseTableBody.innerHTML = "";
  courses.forEach((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.name}</td>
      <td>${course.credits}</td>
      <td>${course.department_name}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${course.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${course.id}">Delete</button>
      </td>
    `;
    courseTableBody.appendChild(row);
  });

  // Attach event listeners for edit and delete
  document
    .querySelectorAll(".edit-btn")
    .forEach((btn) => btn.addEventListener("click", handleCourseEdit));
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", handleCourseDelete));
}

// Render Department Dropdown
function renderDepartmentDropdown(departments) {
  departmentSelect.innerHTML = `<option value="" disabled selected>Select department</option>`;
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department.id;
    option.textContent = department.alias;
    departmentSelect.appendChild(option);
  });
}

// Save Course (Add or Edit)
async function saveCourse(event) {
  event.preventDefault();

  const id = editCourseIdInput.value;
  const courseData = {
    name: courseNameInput.value.trim(),
    credits: parseInt(courseCreditsInput.value, 10),
    department_id: parseInt(departmentSelect.value, 10),
  };

  const method = id ? "PATCH" : "POST";
  const url = id ? `${courseApiUrl}/${id}` : courseApiUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
      body: JSON.stringify(courseData),
    });
    if (response.ok) {
      fetchCourses(); // Refresh course list
      resetCourseForm();
    } else {
      console.error("Failed to save course", response.status);
    }
  } catch (error) {
    console.error("Error saving course", error);
  }
}

// Handle Edit
async function handleCourseEdit(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${courseApiUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const course = data.data;
      editCourseIdInput.value = course.id;
      courseNameInput.value = course.name;
      courseCreditsInput.value = course.credits;
      departmentSelect.value = course.department_id;
      courseSubmitBtn.textContent = "Update";
      hiddenButton.classList.remove("d-none");
    } else {
      console.error("Failed to fetch course details", response.status);
    }
  } catch (error) {
    console.error("Error fetching course details", error);
    alert("Error fetching course details");
  }
}

// Handle Delete
async function handleCourseDelete(event) {
  const id = event.target.dataset.id;
  if (confirm("Are you sure you want to delete this course?")) {
    try {
      const response = await fetch(`${courseApiUrl}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCourses(); // Refresh course list
      } else {
        console.error("Failed to delete course", response.status);
      }
    } catch (error) {
      console.error("Error deleting course", error);
    }
  }
}

// Reset Form
function resetCourseForm() {
  editCourseIdInput.value = "";
  courseNameInput.value = "";
  courseCreditsInput.value = "";
  departmentSelect.value = "";
  courseSubmitBtn.textContent = "Add";
  hiddenButton.classList.add("d-none");
}

// Event Listener
document.getElementById("courseForm").addEventListener("submit", saveCourse);

hiddenButton.addEventListener("click", () => {
  console.log("clicked");
  resetCourseForm();
});

// Fetch courses and departments on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  fetchDepartments();
});
