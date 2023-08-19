const express = require("express");
const pool = require("./db.js"); // Import your PostgreSQL connection pool

const router = express.Router();

// GET /api/fetchBrands - Fetch all brands
router.get("/fetchBrands", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT name, brand_id, description, logo_path FROM Brands WHERE is_active = true"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
