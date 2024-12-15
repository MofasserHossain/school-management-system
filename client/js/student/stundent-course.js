const token = localStorage.getItem("token");
const tableBody = document.querySelector("#studentCourseTable tbody");
const apiURL = "http://localhost:9000/v1/users/course-user";

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");

  const parseUser = JSON.parse(user);

  const decodeToken = atob(token.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;

  console.log(parseUser, role, token, decodeToken, parseToken);
  if (parseUser.role !== role && token && role && role !== "student") {
    localStorage.clear();
    window.location.href = "index.html";
  }
});
// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

async function fetchStudentCourses(role, callback) {
  try {
    const response = await fetch(`${apiURL}?role=${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    });
    const data = await response.json();
    console.log(data);
    const user = data?.data;
    callback(user);
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
                    <td>${course.student_name}</td>
                    <td>${course.student_email}</td>
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
document.addEventListener(
  "DOMContentLoaded",
  fetchStudentCourses("student", renderTable)
);
