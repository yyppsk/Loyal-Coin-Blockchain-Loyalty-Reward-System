const express = require("express");
const router = express.Router();

const Brand = require("./models/Brand"); // Adjust the path as needed
require("./models/associations"); // Adjust the path as needed

router.get("/dashboard", async (req, res) => {
  const BrandRepresentatives = require("./models/BrandRepresentatives");

  try {
    const brandRep = await BrandRepresentatives.findOne({
      where: { representative_id: req.session.representative_id },
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

module.exports = router;
