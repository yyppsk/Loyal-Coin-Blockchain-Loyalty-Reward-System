const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  database: "loyaltycoinsystem",
  username: "postgres",
  password: "pranjal",
  port: 5432,
});

module.exports = {
  sequelize,
};
