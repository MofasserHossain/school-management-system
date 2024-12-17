// DOM Elements
const studentCourseTableBody = document.querySelector(
  "#studentCourseTable tbody"
);
const userSelect = document.getElementById("userSelect");
const courseSelect = document.getElementById("courseSelect");
const studentCourseSubmitBtn = document.getElementById(
  "studentCourseSubmitBtn"
);
const editStudentCourseIdInput = document.getElementById("editStudentCourseId");
const studentCourseCancelBtn = document.getElementById(
  "studentCourseCancelBtn"
);
const roleInput = document.getElementById("roleSelect");

const tokeVal = localStorage.getItem("token");

// API Base URLs
const studentCourseApiUrl = "http://localhost:9000/v1/users/course";
const userApiUrl = "http://localhost:9000/v1/users";
const courseApiUrl = "http://localhost:9000/v1/course-batches";

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/projects/client";
});

// Fetch Users Based on Role
async function fetchUsers(role) {
  try {
    const response = await fetch(`${userApiUrl}?role=${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Populate dropdown and select the first user by default
      renderDropdown(userSelect, data?.data, `Select ${role}`);
      if (data?.data?.length > 0) {
        userSelect.value = data.data[0].id; // Automatically select the first user
      }
      // Update the label to match the selected role
      document.getElementById("user-label").textContent =
        role.charAt(0).toUpperCase() + role.slice(1); // Capitalize the role
    } else {
      console.error("Failed to fetch users", response.status);
    }
  } catch (error) {
    console.error("Error fetching users", error);
  }
}

// Event Listener for Role Change
roleInput.addEventListener("change", (event) => {
  const selectedRole = event.target.value;
  fetchUsers(selectedRole); // Fetch users based on the selected role
});

// Fetch and Render Student Courses
async function fetchStudentCourses() {
  try {
    const response = await fetch(studentCourseApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const studentCourses = data.data;
      renderStudentCourseTable(studentCourses);
    } else {
      console.error("Failed to fetch student courses", response.status);
    }
  } catch (error) {
    console.error("Error fetching student courses", error);
  }
}

// Fetch Users and Courses
async function fetchDropdownData() {
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    };
    const [courses] = await Promise.all([
      // fetch(userApiUrl, options).then((res) => res.json()),
      fetch(courseApiUrl, options).then((res) => res.json()),
    ]);
    // console.log(users, courses);
    // renderDropdown(userSelect, users?.data, "Select student");
    renderDropdown(courseSelect, courses?.data, "Select course");
  } catch (error) {
    console.error("Error fetching dropdown data", error);
  }
}

// Render Student Course Table
function renderStudentCourseTable(studentCourses) {
  studentCourseTableBody.innerHTML = "";
  studentCourses.forEach((studentCourse) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${studentCourse.user_name}</td>
      <td>${studentCourse.student_email}</td>
      <td>${studentCourse.user_role}</td>
      <td>${studentCourse.name}</td>
      <td>${studentCourse.term + " " + studentCourse?.year}</td>
      <td>${studentCourse.section}</td>
      <td>
      <button class="btn btn-danger btn-sm delete-btn" data-id="${
        studentCourse.id
      }">Delete</button>
      </td>
      `;
    // <button class="btn btn-warning btn-sm edit-btn" data-id="${
    //   studentCourse.id
    // }">Edit</button>
    studentCourseTableBody.appendChild(row);
  });

  // Attach event listeners for edit and delete
  document
    .querySelectorAll(".edit-btn")
    .forEach((btn) => btn.addEventListener("click", handleStudentCourseEdit));
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", handleStudentCourseDelete));
}

// Render Dropdowns
function renderDropdown(selectElement, items, placeholder) {
  selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.course_name || item.email;
    selectElement.appendChild(option);
  });
}

// Save Student Course
async function saveStudentCourse(event) {
  event.preventDefault();

  const id = editStudentCourseIdInput.value;
  const studentCourseData = {
    user_id: parseInt(userSelect.value, 10),
    course_batch_id: parseInt(courseSelect.value, 10),
    type: roleInput.value,
  };

  const method = id ? "PATCH" : "POST";
  const url = id ? `${studentCourseApiUrl}/${id}` : studentCourseApiUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentCourseData),
    });
    if (response.ok) {
      fetchStudentCourses(); // Refresh list
      resetStudentCourseForm();
    } else {
      console.error("Failed to save student course", response.status);
    }
  } catch (error) {
    console.error("Error saving student course", error);
  }
}

// Handle Edit
async function handleStudentCourseEdit(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${studentCourseApiUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const studentCourse = data.data;
      editStudentCourseIdInput.value = studentCourse.id;
      userSelect.value = studentCourse.user_id;
      courseSelect.value = studentCourse.course_batch_id;
      roleInput.value = studentCourse.user_role;
      studentCourseSubmitBtn.textContent = "Update";
    } else {
      console.error("Failed to fetch student course details", response.status);
    }
  } catch (error) {
    console.error("Error fetching student course details", error);
    alert("Error fetching student course details");
  }
}

// Handle Delete
async function handleStudentCourseDelete(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${studentCourseApiUrl}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchStudentCourses(); // Refresh list
    } else {
      console.error("Failed to delete student course", response.status);
    }
  } catch (error) {
    console.error("Error deleting student course", error);
  }
}

// Reset Form
function resetStudentCourseForm() {
  editStudentCourseIdInput.value = "";
  userSelect.value = "";
  courseSelect.value = "";
  studentCourseSubmitBtn.textContent = "Add";
  hiddenButton.classList.add("d-none");
}

// Handle Cancel Button
function handleCancel() {
  resetStudentCourseForm();
}

// Event Listener for Cancel Button
studentCourseCancelBtn.addEventListener("click", handleCancel);

// Event Listener
document
  .getElementById("studentCourseForm")
  .addEventListener("submit", saveStudentCourse);

// Fetch Default Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
  // Default role is "Student"
  roleInput.value = "student";
  fetchUsers("student"); // Fetch users for "Student" by default
  fetchDropdownData(); // Fetch courses
  fetchStudentCourses();
});
