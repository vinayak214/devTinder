const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 5,
    max: 30,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value.toLowerCase())) {
        throw new Error("gender must be male, female or other");
      }
    },
  },
  skills: {
    type: [String],
  },
});

userSchema.methods.getJWRTToken = function () {
  const user = this;
  const token = jwt.sign({ id: user }, "vinayak214", { expiresIn: "7h" });
  return token;
};

userSchema.methods.ValidatePassword = async function (passwordbyUser) {
  console.log(`the logged user is ${passwordbyUser}`);
  hashPassword = this.password;
  const isPasswordMatch = await bcrypt.compare(passwordbyUser, hashPassword);
  return isPasswordMatch;
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
