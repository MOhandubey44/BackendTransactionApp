const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: {
      type: Date,
    },
  },
  {
    collection: "transactions",
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
