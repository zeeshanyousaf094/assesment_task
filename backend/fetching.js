const cron = require("node-cron");
const fetchPrices = require("./priceFetcher");
const client = require("./db");
const comparisonMail = require("./comparisonMail");
const alertMail = require("./alertMail");

module.exports = function () {
  const task = cron.schedule("* * * * *", async () => {
    const now = new Date();
    if (now.getMinutes() % 5 === 0) {
      const prices = await fetchPrices();
      try {
        await client.query(
          "INSERT INTO tokenPrices (ethereum, polygon) VALUES ($1, $2)",
          [prices.ethPrice, prices.maticPrice]
        );
        console.log("New prices fetched...");
        comparisonMail(prices);
        alertMail(prices);
      } catch (err) {
        console.error("Error inserting data: " + err.message);
      }
    }
  });

  task.start();
};
