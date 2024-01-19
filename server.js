const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const db = require("./db"); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

// Routes
const initializeDatabaseRoute = require("./routes/initializeDatabase");
const listTransactionsRoute = require("./routes/listTransactions");
const statisticsRoute = require("./routes/statistics");
const barChartRoute = require("./routes/barChart");
const pieChartRoute = require("./routes/pieChart");
const combinedRoute = require("./routes/combined");

app.use("/initialize-database", initializeDatabaseRoute);
app.use("/list-transactions", listTransactionsRoute);
app.use("/statistics", statisticsRoute);
app.use("/bar-chart", barChartRoute);
app.use("/pie-chart", pieChartRoute);
app.use("/", combinedRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
