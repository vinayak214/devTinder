const express = require("express");
const connectDB = require("./config/database"); // database connection
const userModel = require("./models/user");
const app = express(); // creating a new application(like new webserver)!!
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");

app.use(express.json()); // to parse the incoming request body as JSON
app.use(cookieParser());

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const users = await userModel.findOne({ emailId: emailId });
    if (!users || users.length === 0) {
      throw new Error("user not found");
    }
    const isPasswordMatch = await users.ValidatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("password is incorrect");
    } else {
      const token = await jwt.sign({ id: users._id }, "vinayak214", {
        expiresIn: "7h",
      });
      res.cookie("token", token);
      res.send("user logged in successfully!!");
    }
  } catch (error) {
    res.status(500).send("error while logging in the user: " + error.message);
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  const hasPassword = await bcrypt.hash(password, 10); // encrypt the password
  const updatedBody = { ...req.body, password: hasPassword };
  console.log;
  const users = new userModel(updatedBody); //create new instance of userModel
  try {
    await users.save(); // to save the data into database
  } catch (error) {
    res.status(500).send("some error occured while saving the data");
  }
  res.send("user added successfully!!");
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await userModel.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    }
    res.send(users);
  } catch (error) {
    res.send("failed to fetch the data");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (error) {
    res.send("failed to fetch the data");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.loggedUser);
  } catch (error) {
    res.send("Profile fetch failed" + error.message);
  }
});
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
