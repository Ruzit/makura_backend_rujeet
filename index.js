import cors from "cors";
import express from "express";
import admin from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "/Users/rujeetprajapati/My Projects/Makura Tracker/makura_backend/tracker-makura-rujeet-firebase-adminsdk-b0guc-5f8b2cec06.json" assert { type: "json" };

// process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});


// initializeApp({
//   credential: applicationDefault(),
//   projectId: 'tracker-makura-rujeet',
// });

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "tracker-makura-rujeet",
  });

app.post("/send", function (req, res) {
  const receivedToken = req.body.fcmToken;
  const title = req.body.title;
  const body = req.body.body;
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: receivedToken,
  };
  
  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
  
  
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});