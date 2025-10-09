const mongoose = require("mongoose");

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
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
