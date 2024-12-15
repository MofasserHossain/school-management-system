// Sidebar Component
const sidebarContainer = document.getElementById("sidebar");

const nav_logo = document.getElementById("nav_logo-icon");

const showNavbar = (toggleId, navId, bodyId, headerId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

  // Validate that all variables exist
  if (toggle && nav && bodypd && headerpd) {
    toggle.addEventListener("click", () => {
      // show navbar
      nav.classList.toggle("show");
      //   nav_logo.classList.toggle("bx-x");
      // change icon
      toggle.classList.toggle("bx-x");
      // add padding to body
      bodypd.classList.toggle("body-pd");
      // add padding to header
      headerpd.classList.toggle("body-pd");
    });
  }
};

function renderSidebar() {
  const token = localStorage.getItem("token");
  const decodeToken = atob(token.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");
  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  let sidebarItems = "";

  // Role-Based Items
  if (role === "admin") {
    sidebarItems += `
          <a href="user.html" class="nav_link"><i class="bx bx-user"></i>Users<a>
          <a href="department.html" class="nav_link active"><i class="bx bx-bookmark nav_icon"></i>Department<a>
          <a href="batch.html" class="nav_link"><i class="bx bx-bookmark nav_icon"></i>Batches<a>
          <a href="course.html" class="nav_link"><i class="bx bx-bookmark nav_icon"></i>Courses</a>
          <a href="course-batch.html" class="nav_link"><i class="bx bx-bookmark nav_icon"></i>Course Batch</a>
          <a href="user-course.html" class="nav_link"><i class="bx bx-bookmark nav_icon"></i>User Course</a>
        `;
  } else if (role === "teacher") {
    sidebarItems += `
          <a href="course.html" class="nav_link"><i class="bx bx-bookmark nav_icon"></i>My Courses</a>
        `;
  } else if (role === "student") {
    sidebarItems += `
          <a href="course.html" class="nav_link"><i class="bx bx-bookmark nav_icon"></i>My Courses</a>
        `;
  }

  sidebarContainer.innerHTML = sidebarItems;

  // Logout Button Event
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    localStorage.clear(); // Clear all stored data
    window.location.href = "/index.html"; // Redirect to login page
  });
}

// Call the renderSidebar function
document.addEventListener("DOMContentLoaded", renderSidebar);
