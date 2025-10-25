const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const status = "ignored interested accepted rejected";
//Get All pending connection request for logged user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  const loggedUser = req?.loggedUser._id;
  console.log(`loggedUser is ${loggedUser}`);
  try {
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedUser,
      status: "interested",
    }).populate(
      // kind of making realtionship between user and connection with the help pf ref used in connectionRequestSchema model
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );
    console.log(`The values of data are ::${connectionRequest}`);
    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send(`Error is ${error}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedUser = req.loggedUser?._id;
  try {
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedUser, status: "accepted" },
        { fromUserId: loggedUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId.toString() === loggedUser.toString()) {
        return row?.toUserId;
      }
      return row?.fromUserId;
    });
    res.json({
      message: "Connections successfully fetched",
      data,
    });
  } catch (error) {
    res.status(400).send(`Error is ${error}`);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const loggedUser = req.loggedUser?._id;
    console.log(`loggedUser!!! is ${loggedUser}`);

    const connectionFeedUsers = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedUser }, { toUserId: loggedUser }], // checking all the connection user has sent or user has received
    }).select("fromUserId toUserId");

    const hideFromFeed = new Set();
    connectionFeedUsers.forEach((request) => {
      hideFromFeed.add(request.fromUserId.toString());
      hideFromFeed.add(request.toUserId.toString());
    });
    const users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideFromFeed) } },
          { _id: { $ne: loggedUser } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      message: "Loaded all users Successfully",
      data: users,
    });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = userRouter;
