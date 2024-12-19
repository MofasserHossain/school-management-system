const tokeVal = localStorage.getItem("token");
const tableBody = document.querySelector("#studentCourseTable tbody");
const apiURL = "http://localhost:9000/v1/users/course-user";

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

async function fetchStudentCourses(role, callback) {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(`${apiURL}?role=${role}&id=${user?.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
      },
    });
    const data = await response.json();
    // console.log(data);
    const userData = data?.data;
    callback(userData);
  } catch (error) {
    console.error("Error fetching student courses", error);
  }
}

const renderTable = (courses) => {
  if (courses && courses.length > 0) {
    tableBody.innerHTML = ""; // Clear existing rows
    courses.forEach((course) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td>${course.course_name}</td>
                    <td>${course.course_credits}</td>
                    <td>${course.semester}</td>
                    <td>${course.section}</td>
                    <td>${course.batch_name}</td>
                    <td>${course.department_name}</td>
                `;
      tableBody.appendChild(row);
    });
  }
};

// Call the function to fetch and display data when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  if (tokeVal) {
    const decodeToken = atob(tokeVal.split(".")[1]);
    const parseToken = JSON.parse(decodeToken);
    const role = parseToken?.type;
    fetchStudentCourses(role, renderTable);
  }
});
