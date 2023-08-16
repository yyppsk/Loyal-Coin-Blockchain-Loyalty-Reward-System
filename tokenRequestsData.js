const express = require("express");
const router = express.Router();
const pool = require("./db.js");

router.get("/getTokenRequests", async (req, res) => {
  try {
    const query = `
      SELECT tr.*, br.brand_rep_profile_image
      FROM tokenrequests AS tr
      JOIN brandrepresentatives AS br ON tr.brand_rep_id = br.representative_id
      ORDER BY tr.created_at DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    const numRows = result.rows.length; // Get the number of rows returned
    res.json({
      success: true,
      numRows: numRows, // Include the number of rows in the response
      tokenRequests: result.rows,
    });
  } catch (error) {
    console.error("Error fetching token requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch token requests.",
    });
  }
});

router.get("/getRequestsPerDay", async (req, res) => {
  try {
    const query = `
      SELECT DATE(created_at) AS request_date, COUNT(*) AS request_count
      FROM tokenrequests
      GROUP BY request_date
      ORDER BY request_date DESC
      LIMIT 100
    `;
    const result = await pool.query(query);

    const requestsPerDay = result.rows.map((row) => ({
      x: new Date(row.request_date).getTime(),
      y: parseInt(row.request_count), // Convert to a number
    }));

    res.json({
      success: true,
      requestsPerDay: requestsPerDay,
    });
  } catch (error) {
    console.error("Error fetching requests per day:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests per day.",
    });
  }
});

router.get("/getRequestsTotal", async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS total_requests
      FROM tokenrequests
    `;
    const result = await pool.query(query);
    const totalRequests = result.rows[0].total_requests;

    res.json({
      success: true,
      requestsTotal: totalRequests,
    });
  } catch (error) {
    console.error("Error fetching total requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total requests.",
    });
  }
});

module.exports = router;
