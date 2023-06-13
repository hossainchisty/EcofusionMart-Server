// Basic Lib Imports
const express = require("express");
const seedRouter = express.Router();

const { seedUsers, seedProducts } = require("../controllers/seedController");

// Routing Implement
seedRouter.get("/users", seedUsers);
seedRouter.get("/products", seedProducts);

module.exports = seedRouter;
