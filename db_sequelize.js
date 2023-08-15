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

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = {
  sequelize, // Export the sequelize instance
};
