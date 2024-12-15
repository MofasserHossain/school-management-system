// DOM Elements
const courseBatchTableBody = document.querySelector("#courseBatchTable tbody");
const termSelect = document.getElementById("termSelect");
const yearInput = document.getElementById("yearInput");
const sectionSelect = document.getElementById("sectionSelect");
const departmentSelect = document.getElementById("departmentSelect");
const courseSelect = document.getElementById("courseSelect");
const batchSelect = document.getElementById("batchSelect");
const courseBatchSubmitBtn = document.getElementById("courseBatchSubmitBtn");
const editCourseBatchIdInput = document.getElementById("editCourseBatchId");
const token = localStorage.getItem("token");

// API Base URLs
const courseBatchApiUrl = "http://localhost:9000/v1/course-batches";
const departmentApiUrl = "http://localhost:9000/v1/department";
const courseApiUrl = "http://localhost:9000/v1/courses";
const batchApiUrl = "http://localhost:9000/v1/batches";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/projects/client";
});
// Fetch and Render Course Batches
async function fetchCourseBatches() {
  try {
    const response = await fetch(courseBatchApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const courseBatches = data.data;
      renderCourseBatchTable(courseBatches);
    } else {
      console.error("Failed to fetch course batches", response.status);
    }
  } catch (error) {
    console.error("Error fetching course batches", error);
  }
}

// Fetch Departments, Courses, and Batches
async function fetchDropdownData() {
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    };
    const [departments, courses, batches] = await Promise.all([
      fetch(departmentApiUrl, options).then((res) => res.json()),
      fetch(courseApiUrl, options).then((res) => res.json()),
      fetch(batchApiUrl, options).then((res) => res.json()),
    ]);
    renderDropdown(departmentSelect, departments?.data, "Select department");
    renderDropdown(courseSelect, courses?.data, "Select course");
    renderDropdown(batchSelect, batches?.data, "Select batch");
  } catch (error) {
    console.error("Error fetching dropdown data", error);
  }
}

// Render Course Batch Table
function renderCourseBatchTable(courseBatches) {
  courseBatchTableBody.innerHTML = "";
  courseBatches.forEach((batch) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${batch.term}</td>
      <td>${batch.year}</td>
      <td>${batch.section}</td>
      <td>${batch.course_name}</td>
      <td>${batch.batch_name}</td>
      <td>${batch.department_alias}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${batch.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${batch.id}">Delete</button>
      </td>
    `;
    courseBatchTableBody.appendChild(row);
  });

  // Attach event listeners for edit and delete
  document
    .querySelectorAll(".edit-btn")
    .forEach((btn) => btn.addEventListener("click", handleCourseBatchEdit));
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", handleCourseBatchDelete));
}

// Render Dropdowns
function renderDropdown(selectElement, items, placeholder) {
  selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name || item.term || item.section;
    selectElement.appendChild(option);
  });
}

// Save Course Batch
async function saveCourseBatch(event) {
  event.preventDefault();

  const id = editCourseBatchIdInput.value;
  const batchData = {
    term: termSelect.value,
    year: parseInt(yearInput.value, 10),
    section: sectionSelect.value,
    department_id: parseInt(departmentSelect.value, 10),
    course_id: parseInt(courseSelect.value, 10),
    batch_id: parseInt(batchSelect.value, 10),
  };

  const method = id ? "PATCH" : "POST";
  const url = id ? `${courseBatchApiUrl}/${id}` : courseBatchApiUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batchData),
    });
    if (response.ok) {
      fetchCourseBatches(); // Refresh list
      resetCourseBatchForm();
    } else {
      console.error("Failed to save course batch", response.status);
    }
  } catch (error) {
    console.error("Error saving course batch", error);
  }
}

// Handle Edit
async function handleCourseBatchEdit(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${courseBatchApiUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const batch = data.data;
      editCourseBatchIdInput.value = batch.id;
      termSelect.value = batch.term;
      yearInput.value = batch.year;
      sectionSelect.value = batch.section;
      departmentSelect.value = batch.department_id;
      courseSelect.value = batch.course_id;
      batchSelect.value = batch.batch_id;
      courseBatchSubmitBtn.textContent = "Update";
    } else {
      console.error("Failed to fetch course batch details", response.status);
    }
  } catch (error) {
    console.error("Error fetching course batch details", error);
    alert("Error fetching course batch details");
  }
  //   fetch(`${courseBatchApiUrl}/${id}`)
  //     .then((response) => response.json())
  //     .then((batch) => {
  //       editCourseBatchIdInput.value = batch.id;
  //       termSelect.value = batch.term;
  //       yearInput.value = batch.year;
  //       sectionSelect.value = batch.section;
  //       departmentSelect.value = batch.department_id;
  //       courseSelect.value = batch.course_id;
  //       batchSelect.value = batch.batch_id;
  //       courseBatchSubmitBtn.textContent = "Update";
  //     })
  //     .catch((error) =>
  //       console.error("Error fetching course batch details", error)
  //     );
}

// Handle Delete
async function handleCourseBatchDelete(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${courseBatchApiUrl}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchCourseBatches(); // Refresh list
    } else {
      console.error("Failed to delete course batch", response.status);
    }
  } catch (error) {
    console.error("Error deleting course batch", error);
  }
}

// Reset Form
function resetCourseBatchForm() {
  editCourseBatchIdInput.value = "";
  termSelect.value = "";
  yearInput.value = "";
  sectionSelect.value = "";
  departmentSelect.value = "";
  courseSelect.value = "";
  batchSelect.value = "";
  courseBatchSubmitBtn.textContent = "Add";
}

// Event Listener
document
  .getElementById("courseBatchForm")
  .addEventListener("submit", saveCourseBatch);

// Fetch data on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchCourseBatches();
  fetchDropdownData();
});
