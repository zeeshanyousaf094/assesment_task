const express = require("express");
const router = express.Router();
const client = require("../db");

// router.get("/", async (req, res) => {
//   try {
//     const data = await client.query("SELECT * FROM alerts");
//     res.status(200).send(data.rows);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

router.post("/", async (req, res) => {
  try {
    await client.query(
      "INSERT INTO alerts (email, token, price) VALUES ($1, $2, $3)",
      [req.body.email, req.body.token, req.body.price]
    );
    console.log("New alert request added...");
    res.status(200).send("New alert request added...");
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

module.exports = router;
