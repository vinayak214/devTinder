const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  const hasPassword = await bcrypt.hash(password, 10); // encrypt the password
  const updatedBody = { ...req.body, password: hasPassword };
  const users = new userModel(updatedBody); //create new instance of userModel
  try {
    await users.save(); // to save the data into database
  } catch (error) {
    res.status(500).send("some error occured while saving the data");
  }
  res.send("user added successfully!!");
});

authRouter.post("/login", async (req, res) => {
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
      const token = await users.getJWRTToken();
      res.cookie("token", token);
      res.send("user logged in successfully!!");
    }
  } catch (error) {
    res.status(500).send("error while logging in the user: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("user logged out successfully!!");
  } catch (error) {
    res.send("error while logging out the user: " + error.message);
  }
});

module.exports = authRouter;
