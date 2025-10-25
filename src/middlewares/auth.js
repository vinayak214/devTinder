const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;
  try {
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Authentication token not found");
    }
    const decodedObj = await jwt.verify(token, "vinayak214");

    const { _id } = decodedObj.id;

    const loggedUser = await userModel.findById(_id);
    if (!loggedUser) {
      return res.status(401).send("User not found");
    }
    req.loggedUser = loggedUser;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).send("Authentication failed: " + error.message);
  }
};
module.exports = userAuth;
