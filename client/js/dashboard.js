document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token) {
    localStorage.clear();
    window.location.href = "/projects/client";
  }

  const parseUser = JSON.parse(user);

  const decodeToken = atob(token.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;

  console.log(parseUser, role, token, decodeToken, parseToken);
  if (parseUser.role !== role && token && role && role !== "admin") {
    localStorage.clear();
    window.location.href = "/projects/client";
  }
  //   if (!token || !role) {
  //     window.location.href = "index.html";
  //   } else {
  //     document.getElementById(
  //       "welcomeMessage"
  //     ).innerText = `Logged in as Role: ${role}`;
  //   }
  // Logout Functionality
  // document.getElementById("logoutBtn").addEventListener("click", () => {
  //   localStorage.clear();
  //   window.location.href = "index.html";
  // });
});
