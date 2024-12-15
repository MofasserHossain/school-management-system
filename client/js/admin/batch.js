// DOM Elements
const batchTableBody = document.querySelector("#batchTable tbody");
const batchNameInput = document.getElementById("batchName");
const batchSubmitBtn = document.getElementById("batchSubmitBtn");
const editBatchIdInput = document.getElementById("editBatchId");
const token = localStorage.getItem("token");
const hiddenButton = document.getElementById("batchCancelBtn");

// API Base URL
const batchApiUrl = "http://localhost:9000/v1/batches";

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");

  const parseUser = JSON.parse(user);

  const decodeToken = atob(token.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;

  console.log(parseUser, role, token, decodeToken, parseToken);
  if (parseUser.role !== role && token && role) {
    localStorage.clear();
    window.location.href = "index.html";
  }
  // Logout Functionality
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
});

// Fetch Batches and Render Table
async function fetchBatches() {
  try {
    const response = await fetch(batchApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const batches = data.data;
      renderBatchTable(batches);
    } else {
      console.error("Failed to fetch batches", response.status);
    }
  } catch (error) {
    console.error("Error fetching batches", error);
  }
}

// Render Batch Table
function renderBatchTable(batches) {
  batchTableBody.innerHTML = "";
  batches.forEach((batch) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${batch.name}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${batch.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${batch.id}">Delete</button>
      </td>
    `;
    batchTableBody.appendChild(row);
  });

  // Attach event listeners for edit and delete
  document
    .querySelectorAll(".edit-btn")
    .forEach((btn) => btn.addEventListener("click", handleBatchEdit));
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", handleBatchDelete));
}

// Save Batch (Add or Edit)
async function saveBatch(event) {
  event.preventDefault();

  console.log("Saving batch...");

  const id = editBatchIdInput.value;
  const batchData = {
    name: batchNameInput.value.trim(),
  };

  const method = id ? "PATCH" : "POST";
  const url = id ? `${batchApiUrl}/${id}` : batchApiUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
      body: JSON.stringify(batchData),
    });
    if (response.ok) {
      fetchBatches(); // Refresh batch list
      resetBatchForm();
    } else {
      console.error("Failed to save batch", response.status);
    }
  } catch (error) {
    console.error("Error saving batch", error);
  }
}

// Handle Edit
async function handleBatchEdit(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${batchApiUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    });
    if (response.ok) {
      const data = await response.json();
      const batch = data.data;
      editBatchIdInput.value = batch.id;
      batchNameInput.value = batch.name;
      batchSubmitBtn.textContent = "Update";
      hiddenButton.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Error fetching batch details", error);
    alert("Error fetching batch details");
  }
}

// Handle Delete
async function handleBatchDelete(event) {
  const id = event.target.dataset.id;
  if (confirm("Are you sure you want to delete this batch?")) {
    try {
      const response = await fetch(`${batchApiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      if (response.ok) {
        fetchBatches(); // Refresh batch list
      } else {
        console.error("Failed to delete batch", response.status);
      }
    } catch (error) {
      console.error("Error deleting batch", error);
    }
  }
}

// Reset Form
function resetBatchForm() {
  editBatchIdInput.value = "";
  batchNameInput.value = "";
  batchSubmitBtn.textContent = "Add";
  hiddenButton.classList.add("d-none");
}

hiddenButton.addEventListener("click", () => {
  resetBatchForm();
});

// Event Listener
document.getElementById("batchForm").addEventListener("submit", saveBatch);

// Fetch batches on page load
document.addEventListener("DOMContentLoaded", fetchBatches);
