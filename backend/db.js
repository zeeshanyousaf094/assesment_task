const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "TestDB",
  password: "admin",
  port: 5432,
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    return checkAndCreateTable();
  })
  .catch((err) => console.error("Connection error", err.stack));

async function checkAndCreateTable() {
  const tableName1 = "tokenPrices";
  const createTableQuery1 = `
    CREATE TABLE IF NOT EXISTS ${tableName1} (
      id SERIAL PRIMARY KEY,
      ethereum NUMERIC(10, 4),
      polygon NUMERIC(10, 4),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const tableName2 = "alerts";
  const createTableQuery2 = `
    CREATE TABLE IF NOT EXISTS ${tableName2} (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255),
      token VARCHAR(255),
      price NUMERIC(10, 4)
    )
  `;

  try {
    const res1 = await client.query(`SELECT to_regclass('${tableName1}');`);
    if (res1.rows[0].to_regclass === null) {
      await client.query(createTableQuery1);
      console.log(`Table "${tableName1}" created successfully.`);
    } else {
      console.log(`Table "${tableName1}" already exists.`);
    }
    const res2 = await client.query(`SELECT to_regclass('${tableName2}');`);
    if (res2.rows[0].to_regclass === null) {
      await client.query(createTableQuery2);
      console.log(`Table "${tableName2}" created successfully.`);
    } else {
      console.log(`Table "${tableName2}" already exists.`);
    }
  } catch (error) {
    console.error("Error checking or creating table:", error);
  }
}

module.exports = client;
