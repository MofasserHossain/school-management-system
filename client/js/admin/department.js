// Get the token from localStorage
const tokeVal = localStorage.getItem("token");
// if (!token) {
//   window.location.href = "index.html"; // Redirect to login if no token exists
// }

// API URL
const apiUrl = "http://localhost:9000/v1/department";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/projects/client";
});
// DOM Elements
const tableBody = document.querySelector("#departmentTable tbody");
const nameDom = document.getElementById("name");
const aliasDom = document.getElementById("alias");
const buttonDom = document.getElementById("submitBtn");
const editIdDom = document.getElementById("editId");
const formDom = document.getElementById("departmentForm");

// Function to fetch departments (GET request)
async function fetchDepartments() {
  tableBody.innerHTML = ""; // Clear table

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokeVal}`, // Include the token
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const list = data.data;

    list.forEach((item) => {
      const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editDepartment('${item.id}', '${item.name}', '${item.alias}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteDepartment('${item.id}')">Delete</button>
                    </td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
}

// Function to add or update a department
formDom.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = nameDom.value;
  const alias = aliasDom.value;
  const editId = editIdDom.value;

  const requestBody = { name, alias };

  try {
    const method = editId ? "PATCH" : "POST";
    const endpoint = editId ? `${apiUrl}/${editId}` : apiUrl;

    await fetch(endpoint, {
      method: method,
      headers: {
        Authorization: `Bearer ${tokeVal}`, // Include the token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Reset form and refresh table
    formDom.reset();
    editIdDom.value = "";
    buttonDom.innerText = "Add";
    fetchDepartments();
  } catch (error) {
    console.error("Error adding/updating department:", error);
  }
});

// Function to delete a department
async function deleteDepartment(id) {
  if (confirm("Are you sure you want to delete this department?")) {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokeVal}`, // Include the token
        },
      });
      fetchDepartments(); // Refresh table
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  }
}

// Populate form for editing
function editDepartment(id, name, alias) {
  nameDom.value = name;
  aliasDom.value = alias;
  editIdDom.value = id;
  buttonDom.innerText = "Update";
}

// On page load, fetch the departments
document.addEventListener("DOMContentLoaded", fetchDepartments);
