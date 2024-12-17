const tokeVal = localStorage.getItem("token");
const tableBody = document.querySelector("#studentGradeTable tbody");
const apiURL = "http://localhost:9000/v1/student/grades";

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

async function fetchStudentCourses(id, callback) {
  try {
    const response = await fetch(`${apiURL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeVal}`, // Include the token
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
      //  "id": 2,
      //       "mark": 65,
      //       "grade": "B",
      //       "course_id": 1,
      //       "batch_id": 1,
      //       "course_batch_id": 1,
      //       "created_at": "2024-12-17T19:31:31.000Z",
      //       "term": "spring",
      //       "section": "D1",
      //       "year": 2021,
      //       "course_name": "Structure Programming 32"
      row.innerHTML = `
                    <td>${course.course_name}</td>
                    <td>${course.credits}</td>
                    <td>${course.term}</td>
                    <td>${course.section}</td>
                    <td>${
                      course.grade ? course.grade : "Grade not available"
                    }</td>
                `;
      tableBody.appendChild(row);
    });
  }
};

// Call the function to fetch and display data when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) fetchStudentCourses(user?.id, renderTable);
});
