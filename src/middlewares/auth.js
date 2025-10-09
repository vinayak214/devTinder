const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;
  try {
    const { token } = cookies;
    if (!token) {
      throw new Error("Authentication token not found");
    }
    const decodedObj = await jwt.verify(token, "vinayak214");
    console.log(decodedObj);

    const { id } = decodedObj;
    const loggedUser = await userModel.findById(id);
    console.log(loggedUser);
    if (!loggedUser) {
      throw new Error("User not found");
    }
    req.loggedUser = loggedUser;
    next();
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
};
module.exports = userAuth;
