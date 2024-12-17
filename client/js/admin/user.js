// DOM Elements
const userTableBody = document.querySelector("#userTable tbody");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const editIdInput = document.getElementById("editId");
const updateformdoc = document.getElementById("userForm");
const tokeVal = localStorage.getItem("token");

// API Base URL
const apiUrl = "http://localhost:9000/v1/users";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/projects/client";
});
// Fetch Users and Render Table
async function fetchUsers() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokeVal}`, // Include the token
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const users = await response.json();
      const res = await users?.data;
      renderUserTable(res);
    } else {
      console.error("Failed to fetch users", response.status);
    }
  } catch (error) {
    console.error("Error fetching users", error);
  }
}

// Render User Table
function renderUserTable(users) {
  userTableBody.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.first_name} ${user.last_name}</td>
      <td>${user.email}</td>
      <td class="text-uppercase">${user.role}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${user.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Delete</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });

  // Attach event listeners for edit and delete
  document
    .querySelectorAll(".edit-btn")
    .forEach((btn) => btn.addEventListener("click", handleEdit));
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", handleDelete));
}

// Save User (Add or Edit)
async function saveUser(event) {
  event.preventDefault();

  const id = editIdInput.value;
  const userData = {
    first_name: firstNameInput.value.trim(),
    last_name: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    role: roleInput.value,
  };

  // Add password only for new users
  if (!id) {
    userData.password = passwordInput.value.trim() || "admin@12345";
  }

  const method = id ? "PATCH" : "POST";
  const url = id ? `${apiUrl}/${id}` : apiUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${tokeVal}`, // Include the token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      fetchUsers(); // Refresh user list
      resetForm();
    } else {
      console.error("Failed to save user", response.status);
    }
  } catch (error) {
    console.error("Error saving user", error);
  }
}

// Handle Edit
async function handleEdit(event) {
  const id = event.target.dataset.id;
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (response.ok) {
      const data = await response.json();
      const user = data?.data;
      if (user) {
        editIdInput.value = user.id;
        firstNameInput.value = user.first_name;
        lastNameInput.value = user.last_name;
        emailInput.value = user.email;
        roleInput.value = user.role;
        passwordInput.parentElement.style.display = "none"; // Hide password field during edit
        submitBtn.textContent = "Update";
      } else {
        console.error("Failed to fetch user details", response.status);
        alert("Failed to fetch user details");
      }
    } else {
      console.error("Failed to fetch user details", response.status);
    }
  } catch (error) {
    console.error("Error fetching user details", error);
    alert("Error fetching user details");
  }
}

// Handle Delete
async function handleDelete(event) {
  const id = event.target.dataset.id;
  if (confirm("Are you sure you want to delete the user?")) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokeVal}`, // Include the token
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchUsers(); // Refresh user list
      } else {
        console.error("Failed to delete user", response.status);
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  }
}

// Reset Form
function resetForm() {
  editIdInput.value = "";
  firstNameInput.value = "";
  lastNameInput.value = "";
  emailInput.value = "";
  roleInput.value = "";
  passwordInput.value = "";
  passwordInput.parentElement.style.display = ""; // Show password field for new users
  submitBtn.textContent = "Add";
}

// Event Listener
updateformdoc.addEventListener("submit", saveUser);

// Fetch users on page load
document.addEventListener("DOMContentLoaded", fetchUsers);
