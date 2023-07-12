// Database Lib Import
require("dotenv").config();
const mongoose = require("mongoose");

// Mongo DB Database Connection
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    mongoose.set("debug", false);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
