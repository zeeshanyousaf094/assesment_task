const nodemailer = require("nodemailer");
const client = require("./db");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testingwithali1@gmail.com",
    pass: "ntjz hpfz jasv lvnn",
  },
});

const comparisonMail = async (prices) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  console.log(oneHourAgo);
  try {
    const data = await client.query(
      `
      SELECT *
      FROM tokenPrices
      WHERE date_trunc('minute', created_at::timestamp) = date_trunc('minute', $1::timestamp)
      LIMIT 1;
  `,
      [oneHourAgo]
    );
    if (data.rows.length != 0) {
      const oldEth = data.rows[0].ethereum;
      const oldPolygon = data.rows[0].polygon;

      function hasPriceIncreased(oldPrice, newPrice) {
        const increaseThreshold = oldPrice * 0.03;
        const thresholdPrice = oldPrice + increaseThreshold;
        return newPrice >= thresholdPrice;
      }

      if (
        hasPriceIncreased(oldEth, prices.ethPrice) &&
        hasPriceIncreased(oldPolygon, prices.maticPrice)
      ) {
        transporter.sendMail({
          from: "testingwithali1@gmail.com",
          to: "hyperhire_assignment@hyperhire.in",
          subject: "Price of Both Tokens has increased by 3% or more",
          text: `Old price of ethereum is ${oldEth} and new price is ${prices.ethPrice} .Old price of polygon is ${oldPolygon} and new price is ${prices.maticPrice} .`,
        });
      } else if (hasPriceIncreased(oldEth, prices.ethPrice)) {
        transporter.sendMail({
          from: "testingwithali1@gmail.com",
          to: "hyperhire_assignment@hyperhire.in",
          subject: "Price of Ethereum has increased by 3% or more",
          text: `Old price of ethereum is ${oldEth} and new price is ${prices.ethPrice} .`,
        });
      } else if (hasPriceIncreased(oldPolygon, prices.maticPrice)) {
        transporter.sendMail({
          from: "testingwithali1@gmail.com",
          to: "hyperhire_assignment@hyperhire.in",
          subject: "Price of Polygon has increased by 3% or more",
          text: `Old price of polygon is ${oldPolygon} and new price is ${prices.maticPrice} .`,
        });
      }
    } else {
      console.log("One hour earlier record does not exist yet!!!");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = comparisonMail;
