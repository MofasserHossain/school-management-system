const express = require("express");
const app = express();
const router = require("./routes");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/v1", router);

app.use("/health", (req, res) => {
  res.send("Server is running");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
