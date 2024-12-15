const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  const parseUser = JSON.parse(user);

  if (!token) {
    localStorage.clear();
    window.location.href = "/projects/client";
  }

  const decodeToken = atob(token.split(".")[1]);
  const parseToken = JSON.parse(decodeToken);
  const role = parseToken?.type;

  console.log(parseUser, role, token, decodeToken, parseToken);
  if (parseUser.role !== role && token && role && role !== "teacher") {
    localStorage.clear();
    window.location.href = "/projects/client";
  }
});
