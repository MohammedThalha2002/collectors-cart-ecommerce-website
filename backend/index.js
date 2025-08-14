import express from "express";
import cors from "cors";
import postRouter from "./routes/postRoute.js";
import authRouter from "./routes/authRoute.js";
import mailRouter from "./routes/mailRoute.js";
import profileRouter from "./routes/profileRoute.js";
import metricsRouter from "./controller/orders/metricsController.js";
import logger from "./config/logger.js";
import morgan from "morgan";
import dotenv from "dotenv";
import admin from "./config/firebase.js";
import "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/Uploads/Images", express.static("./Uploads/Images"));
app.use("/Uploads/test_images", express.static("./Uploads/test_images"));
app.use("/Uploads/Invoices", express.static("./Uploads/Invoices"));

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

//
app.use("/auth", authRouter);
app.use("/api", postRouter);
app.use("/api", profileRouter);
app.use("/mail", mailRouter);
app.use("/metrics", metricsRouter);

app.get("/", (req, res) => {
  console.log("GET REQ");
  res.send("GETTING REQUEST SUCCESSFULLY");
});

app.get("/test-notification", async (req, res) => {
  const payload = {
    notification: {
      title: "This is a Notification",
      body: "This is the body of the notification message.",
    },
    topic: "admins",
  };

  admin
    .messaging()
    .send(payload)
    .then((response) => {
      console.log("Notification sent successfully:", response);
      res.status(200).send("Notification sent successfully");
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).send("Error sending notification");
    });
});

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
