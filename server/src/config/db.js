const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("MongoDB connected successfully:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if unable to connect
  }
};

module.exports = connectDB;
