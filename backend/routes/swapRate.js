const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const eth = req.body.eth;
    const response1 = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=btc"
    );
    const ethToBtc = response1.data.ethereum.btc;
    const bitcoins = eth * ethToBtc;
    const response2 = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const ethToDollar = response2.data.ethereum.usd;
    const dollars = eth * ethToDollar;
    const fee = dollars * 0.0003;
    console.log(
      `You will get ${bitcoins} Bitcoins for ${eth} Ethereum and our fee will be $${fee}....`
    );
    res.status(200).json({
      btc: bitcoins,
      fee: fee,
      eth: eth,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ Error: err.message });
  }
});

module.exports = router;
