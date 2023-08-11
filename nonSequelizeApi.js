const express = require("express");
const db = require("./db_non_sequelize"); // Use the non-Sequelize db.js

const router = express.Router();

router.get("/non-sequelize", async (req, res) => {
  try {
    const client = await db.pool.connect();
    // ... Your database operations using non-Sequelize approach ...
    res.json({ message: "Non-Sequelize API response" });
  } catch (error) {
    console.error("Non-Sequelize API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
