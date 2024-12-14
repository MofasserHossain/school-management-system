require("dotenv").config();

const app = require("./app");
const config = require("./config/config");

const PORT = config.port || 5000;

app.listen(PORT, function () {
  console.log("server connected to port " + PORT);
});
