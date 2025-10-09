const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vinayak214:NeDOdCnQyg6OTH8o@explomongo.vte2ix8.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
