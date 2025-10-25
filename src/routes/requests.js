const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req?.loggedUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"]; // This will prevent user from changing the status to accepted apart from ignore/intrested!

      if (!allowedStatus.includes(status)) {
        res.status(400).send("status is not correct");
        return;
      }
      const toUserIdExists = await user.findById(toUserId);

      if (!toUserIdExists) {
        return res.status(404).json({ message: "To UserId Doesnot Exists!!!" });
      }

      //If already a request exists!!
      const existingConnectionReq = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionReq) {
        return res.status(400).send("connection already exists");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "connection success",
        data,
      });
    } catch (error) {
      res.status(404).send("Error", error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.loggedUser._id;
      console.log(`The logged user is ${loggedUser}`);

      const status = req.params.status.toLowerCase(); // req.params is when we pass values as :value
      const { requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedUser,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      return res.json({ message: `Connection request ${status}`, data });
    } catch (error) {
      console.error("Error reviewing request:", error);
      return res
        .status(500)
        .json({ message: "Error reviewing request", error: error.message });
    }
  }
);

module.exports = requestRouter;
