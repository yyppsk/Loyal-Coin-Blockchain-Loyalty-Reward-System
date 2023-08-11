const { Pool } = require("pg");

// Create a new pool for PostgreSQL database connections
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "loyaltycoinsystem",
  password: "pranjal",
  port: 5432,
});

module.exports = {
  pool,
};
