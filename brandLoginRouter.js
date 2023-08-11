//Storing the API's which follow non sequelize appraoch

const express = require("express");
const db = require("./db_non_sequelize"); // Use the non-Sequelize db.js
const router = express.Router();
const app = express();
// Login API endpoint required for logging in
router.use(express.json()); // Parse JSON requests
app.use(express.json()); // Parse JSON requests

router.post("/brandlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Attempting login...");
    const client = await db.pool.connect();

    // Begin a transaction
    await client.query("BEGIN");

    const query = "SELECT * FROM brands WHERE email = $1 AND password = $2";
    const result = await client.query(query, [email, password]);

    if (result.rows.length > 0) {
      // Commit the transaction

      await client.query("COMMIT");
      // console.log("Login query result:", result.rows);
      console.log("Login query result:", typeof result.rows[0].brand_id);
      let idbrandlogin = result.rows[0].brand_id;

      req.session.userId = idbrandlogin;

      console.log("Login query result:", typeof req.session.userId);
      // Set the user session for maintaining sessions across the platform
      console.log("Login successful:", result.rows[0]);

      // Send a success response with brand data
      res
        .status(200)
        .json({ message: "Login successful", brand: result.rows[0] });
    } else {
      // Commit the transaction
      await client.query("COMMIT");

      console.log("Login failed: Invalid email or password");

      // Send an error response
      res.status(401).json({ message: "Invalid email or password" });
    }

    // Release the client connection back to the pool
    client.release();
  } catch (error) {
    console.error("Login error:", error);
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/non-sequelize", async (req, res) => {
  try {
    const client = await db.pool.connect();
    // ... Your database operations using non-Sequelize approach ...
    console.log("Non-Sequelize API response");
    res.json({ message: "Non-Sequelize API response" });
  } catch (error) {
    console.error("Non-Sequelize API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
