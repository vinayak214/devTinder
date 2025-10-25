const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    return res.status(200).send(req.loggedUser);
  } catch (error) {
    console.error("Profile fetch failed:", error);
    return res.status(500).send("Profile fetch failed: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("No updates provided");
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "photoUrl",
      "skills",
    ];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((field) =>
      allowedFields.includes(field)
    );

    if (!isValidOperation) {
      return res
        .status(400)
        .send("Invalid updates! Allowed fields: " + allowedFields.join(", "));
    }

    const loggedUser = req.loggedUser;
    updates.forEach((field) => {
      loggedUser[field] = req.body[field];
    });

    // persist changes
    await loggedUser.save();

    return res
      .status(200)
      .send({ message: "Profile updated successfully!!", user: loggedUser });
  } catch (error) {
    console.error("Profile update failed:", error);
    return res.status(400).send("Profile update failed: " + error.message);
  }
});

module.exports = profileRouter;
