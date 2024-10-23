const express = require("express");
const cors = require("cors");
const client = require("./db");
const hours = require("./routes/hourlyRecord");
const swap = require("./routes/swapRate");
const alerts = require("./routes/setAlerts");

const app = express();
const port = 4000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
  })
);
require("./fetching")();
app.use("/hours", hours);
app.use("/swap", swap);
app.use("/alerts", alerts);

app.get("/", async (req, res) => {
  try {
    const data = await client.query("SELECT * FROM tokenPrices");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
