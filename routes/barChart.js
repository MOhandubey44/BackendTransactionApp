const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); 

router.get('/', async (req, res) => {
  try {
    console.log('Bar Chart Route - Request Received');

    const { month } = req.query;
    console.log('Month:', month);

    let filter = {};

    // If month is provided, add the date filter
    function monthNameToMM(monthName) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const monthIndex = monthNames.indexOf(monthName);

      return (monthIndex + 1).toString().padStart(2, "0");
    }

    if (month) {
      const monthMM = monthNameToMM(month);

      if (monthMM) {
        // Set the year to a constant value 
        const year = 2022;
        
        const startDate = new Date(`${year}-${monthMM}-01T00:00:00.000+00:00`);
        const nextMonth = monthMM === "12" ? "01" : (parseInt(monthMM) + 1).toString().padStart(2, "0");
        const endDate = new Date(`${year}-${nextMonth}-01T00:00:00.000+00:00`);

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

    // Fetch transactions based on the filter
    const filteredTransactions = await Transaction.find(filter);

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    // Initialize counts for each price range
    const priceRangeCounts = Array(priceRanges.length).fill(0);

    // Count items in each price range
    filteredTransactions.forEach((transaction) => {
      const price = transaction.price;
      for (let i = 0; i < priceRanges.length; i++) {
        if (price >= priceRanges[i].min && price <= priceRanges[i].max) {
          priceRangeCounts[i]++;
          break;
        }
      }
    });

    // Prepare the bar chart data
    const barChartData = priceRanges.map((range, index) => ({
      priceRange: `${range.min} - ${range.max === Infinity ? 'above' : range.max}`,
      itemCount: priceRangeCounts[index],
    }));

    console.log('Bar Chart Route - Response Sent');
    res.json({ barChartData });
  } catch (error) {
    console.error('Bar Chart Route - Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
