const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_sequelize"); // Adjust the path as needed

const BrandRepresentatives = sequelize.define("brandrepresentatives", {
  representative_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "brands",
      key: "brand_id",
    },
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
  name: {
    type: DataTypes.STRING,
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
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = BrandRepresentatives;
