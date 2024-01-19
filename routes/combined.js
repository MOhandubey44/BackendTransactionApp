const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const initializeResponse = await axios.get('http://localhost:3000/initialize-database');
    const listTransactionsResponse = await axios.get('http://localhost:3000/list-transactions');
    const statisticsResponse = await axios.get('http://localhost:3000/statistics');
    const barChartResponse = await axios.get('http://localhost:3000/bar-chart');
    const pieChartResponse = await axios.get('http://localhost:3000/pie-chart');

    const combinedResponse = {
      initialize: initializeResponse.data,
      listTransactions: listTransactionsResponse.data,
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.json(combinedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
