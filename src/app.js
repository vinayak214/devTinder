const express = require("express");
const connectDB = require("./config/database"); // database connection
const userModel = require("./models/user");
const app = express(); // creating a new application(like new webserver)!!
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json()); // to parse the incoming request body as JSON
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// connect to database and start the serve

connectDB()
  .then(() => {
    console.log("MongoDB is connected!!");
    app.listen(3000, () => {
      console.log("server is successfully running!!");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
