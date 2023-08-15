const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_sequelize"); // Update the path as needed
const Brand = sequelize.define("brands", {
  brand_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loyalty_coin_balance: {
    type: DataTypes.INTEGER,
  },
  blockchain_address: {
    type: DataTypes.STRING,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  logo_path: {
    type: DataTypes.STRING, // Adjust the data type as needed
    allowNull: false,
  },
});
module.exports = Brand;
