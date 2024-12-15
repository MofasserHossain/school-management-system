const button = document.getElementById("loginForm");
const emailDoc = document.getElementById("email");
const passwordDoc = document.getElementById("password");

// Redirect to dashboard if token and role exist
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const parseUser = JSON.parse(user);

  const decodeToken = atob(token.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken.role;

  console.log(parseUser.role, role, token, decodeToken, parseToken);

  if (parseUser.role === role && token && role) {
    window.location.href = "dashboard.html";
  }
});

// Handle form submission for login
button.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get form data
  const email = emailDoc.value;
  const password = passwordDoc.value;

  if (!email || !password) {
    document.getElementById("errorAlert").innerText =
      "Please provide email and password";
    document.getElementById("errorAlert").classList.remove("d-none");
  }

  document.getElementById("errorAlert").classList.add("d-none");
  // API Endpoint
  const apiUrl = "http://localhost:9000/v1/auth/login";

  button.setAttribute("disabled", "disabled");
  try {
    // Send POST request to API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // Parse response
    const data = await response.json();
    console.log(data);
    if (data.status === "success") {
      // Store token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirect to dashboard
      if (data.user.role === "admin") {
        window.location.href = "department.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      // Show error alert
      document.getElementById("errorAlert").innerText =
        data.message || "Login failed!";
      document.getElementById("errorAlert").classList.remove("d-none");
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("errorAlert").innerText =
      "An error occurred. Please try again.";
    document.getElementById("errorAlert").classList.remove("d-none");
  } finally {
    button.removeAttribute("disabled");
  }
});
