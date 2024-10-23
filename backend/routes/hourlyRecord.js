const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/", async (req, res) => {
  try {
    const data = await client.query(`
        SELECT *
        FROM tokenPrices
        WHERE created_at >= NOW() - INTERVAL '24 hours'
          AND EXTRACT(MINUTE FROM created_at) = 0
        ORDER BY created_at;
      `);
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
