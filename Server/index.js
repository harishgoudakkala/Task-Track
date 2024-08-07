require("dotenv").config();
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
require("./config/passport")
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const userRoutes = require("./Routes/userRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const profileRoutes = require("./Routes/profileRoutes");

const app = express();

app.use(helmet());
app.use(cookieParser());

const allowedOrigins = ["https://task-track-five.vercel.app", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, { origin: true });
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
  })
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});

app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbURI = process.env.MONGOURL;

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/users", userRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/profiles", profileRoutes);

const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Server running on port ${port} http://localhost:${port}`);
});
