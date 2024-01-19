const express = require("express");
const axios = require("axios");
const router = express.Router();
const mongoose = require("mongoose");

const Transaction = require('../models/Transaction');


router.get("/", async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/MyDatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch data from the third-party API
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const seedData = response.data; // Use this data to initialize your database

    
    await Transaction.deleteMany({});

   
    await Transaction.insertMany(seedData);

    // await mongoose.disconnect();

    res.json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
