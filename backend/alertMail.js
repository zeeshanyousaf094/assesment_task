const nodemailer = require("nodemailer");
const client = require("./db");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testingwithali1@gmail.com",
    pass: "ntjz hpfz jasv lvnn",
  },
});

const alertMail = async (prices) => {
  try {
    const data1 = await client.query(
      `
      WITH deleted_rows AS (
        DELETE FROM alerts
        WHERE token = $1 AND price < $2
        RETURNING *
    )
    SELECT * FROM deleted_rows;`,
      ["ethereum", prices.ethPrice]
    );
    data1.rows &&
      data1.rows.map((row) => {
        transporter.sendMail({
          from: "testingwithali1@gmail.com",
          to: row.email,
          subject: `Price of ${row.token} has increased more than your check!`,
          text: `Current price of ethereum is $${prices.ethPrice} which is more then your check price of $${row.price} .`,
        });
      });
    const data2 = await client.query(
      `
    WITH deleted_rows AS (
        DELETE FROM alerts
        WHERE token = $1 AND price < $2
        RETURNING *
    )
    SELECT * FROM deleted_rows;
  `,
      ["polygon", prices.maticPrice]
    );
    data2.rows &&
      data2.rows.map((row) => {
        transporter.sendMail({
          from: "testingwithali1@gmail.com",
          to: row.email,
          subject: `Price of ${row.token} has increased more than your check!`,
          text: `Current price of Polygon is $${prices.maticPrice} which is more then your check price of $${row.price} .`,
        });
      });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = alertMail;
