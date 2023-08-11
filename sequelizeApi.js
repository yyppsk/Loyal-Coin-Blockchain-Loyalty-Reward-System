const express = require("express");
const db = require("./db_sequelize"); // Use the Sequelize db.js
const { Sequelize } = require("sequelize");
const app = express();
app.use(express.static("public"));
const router = express.Router();

const Brand = db.sequelize.define("Brand", {
  // Define your Sequelize model here
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

app.get("/api/dashboard", async (req, res) => {
  const BrandRepresentatives = require("./models/BrandRepresentatives");
  const Brand = require("./models/Brand"); // Import the Brand model

  try {
    const brandRep = await BrandRepresentatives.findOne({
      where: { id: req.session.representative_id },
      include: Brand, // Include associated Brand data
    });

    if (brandRep) {
      res.json({
        representative: brandRep,
        brand: brandRep.Brand,
      });
    } else {
      res.status(404).json({ message: "Brand representative not found" });
    }
  } catch (error) {
    console.error("Error fetching brand representative:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sequelize", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    // ... Your Sequelize database operations ...
    res.json({ message: "Sequelize API response" });
  } catch (error) {
    console.error("Sequelize API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
