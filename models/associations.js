// associations.js
const Brand = require("./Brand");
const BrandRepresentatives = require("./BrandRepresentatives");

// Define associations
BrandRepresentatives.belongsTo(Brand, { foreignKey: "brand_id" });
Brand.hasMany(BrandRepresentatives, { foreignKey: "brand_id" });
