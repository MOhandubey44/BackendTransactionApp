const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {

  try {
    
    console.log('List Transactions Route - Request Received');

    const { month } = req.query;
    console.log('Month:', month);

    const validMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (month && !validMonthRegex.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM.' });
    }

    // Create an empty filter object
    let filter = {};

    // If month is provided, add the date filter
    if (month) {
      filter = {
        dateOfSale: {
          $gte: new Date(`${month}-01T00:00:00.000Z`), 
          $lt: new Date(`${month + 1}-01T00:00:00.000Z`), 
        },
      };
    }

    
    const filteredTransactions = await Transaction.find(filter);

    // Extract unique categories and count items for each category
    const categoryCounts = filteredTransactions.reduce((accumulator, transaction) => {
      const category = transaction.category;
      accumulator[category] = (accumulator[category] || 0) + 1;
      return accumulator;
    }, {});

    // pie chart data
    const pieChartData = Object.keys(categoryCounts).map(category => ({
      category,
      itemCount: categoryCounts[category],
    }));

    res.json({ pieChartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
