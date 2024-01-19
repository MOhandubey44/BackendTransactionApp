const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    console.log('Statistics Route - Request Received');

    const { month } = req.query;
    console.log('Month:', month);

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

      
      return (monthIndex + 1).toString().padStart(2, "0");
    }

    // Create an empty filter object
    let filter = {};

    
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

        // Check for invalid date range
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

    // Fetch statistics based on the filter
    const totalSaleAmount = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments(filter);
    const totalNotSoldItems = await Transaction.countDocuments({ ...filter, isSold: false });

    console.log('Statistics Route - Response Sent');
    res.json({
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Statistics Route - Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
