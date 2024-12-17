const express = require("express");
const app = express();
const router = require("./routes");
const cors = require("cors");

const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

app.get("/send", (req, res) => {
  // const { token, title, body } = req.query;
  const message = {
    notification: {
      title: "Hi",
      body: "Dropped off: Srishti has been safely dropped off at the stop location. Check notification for next pickup",
    },
    data: {
      studentId: "3232323",
      studentName: "Sudeep",
      typeText: "Drop off",
      type: "drop", // 'drop', 'pickup', 'head-up', 'warning', 'reminder'
    },
    android: {
      notification: {
        imageUrl:
          "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9",
      },
    },
    token:
      "dYEGW8kUQ5-DjRn9LLB0a5:APA91bEtl-fTGNSpylmZJPm_0niEUr6VW52l1eaXdW9D747EbQthcNc01HeiVqaO9aDSmmxT_H6DFGE2Rbxh7BvYMXxkqcLY-68r2uvZlYIRVSyzp8Kj32A",
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

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
