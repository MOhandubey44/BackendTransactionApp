const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Import the Mongoose model

router.get("/", async (req, res) => {
  try {
    console.log("List Transactions Route - Request Received");
    console.log("Query Parameters:", req.query);

    const { month, search, page, perPage } = req.query;
    console.log("Month:", month);

    // Create an empty filter object
    let filter = {};

   
    // Function to convert month name to MM format
    function monthNameToMM(monthName) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthIndex = monthNames.indexOf(monthName);

      // Add 1 to the index to get the month number and pad with a leading zero
      return (monthIndex + 1).toString().padStart(2, "0");
    }

    // Inside your route handler
    if (month) {
      const monthMM = monthNameToMM(month);

      if (monthMM) {
        const startDate = new Date(`2022-${monthMM}-01T00:00:00.000+00:00`);

        // Correcting the calculation of the next month
        const nextMonth =
          monthMM === "12"
            ? "01"
            : (parseInt(monthMM) + 1).toString().padStart(2, "0");
        const endDate = new Date(`2022-${nextMonth}-01T00:00:00.000+00:00`);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date range.' });
        }
      

        filter = {
          dateOfSale: {
            $gte: startDate,
            $lt: endDate,
          },
        };
      }
    }

    // Fetch total count without pagination
    const totalCount = await Transaction.countDocuments(filter);

    // Pagination
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const paginatedTransactions = await Transaction.find(filter)
      .skip(startIndex)
      .limit(itemsPerPage);

    // Search
    const searchedTransactions = search
      ? paginatedTransactions.filter(
          (transaction) =>
            transaction.title.toLowerCase().includes(search.toLowerCase()) ||
            transaction.description
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            transaction.price.toString().includes(search)
        )
      : paginatedTransactions;

    console.log("List Transactions Route - Response Sent");
    res.json({ transactions: searchedTransactions, totalPages, currentPage });
  } catch (error) {
    console.error("List Transactions Route - Error:", error);
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
