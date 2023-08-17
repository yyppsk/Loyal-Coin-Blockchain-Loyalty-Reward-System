// updateTables.js
const express = require("express");
const router = express.Router();
const pool = require("./db.js"); // Import your PostgreSQL database connection pool

router.post("/", async (req, res) => {
  try {
    const { requestId, txHash } = req.body;

    // Update TokenRequests table with txHash
    const updateTokenRequestsQuery = `
      UPDATE tokenrequests
      SET txhash = $1, pending = true
      WHERE request_id = $2
    `;
    await pool.query(updateTokenRequestsQuery, [txHash, requestId]);

    // Get brand details for the given requestId (you need to adjust this query based on your table structure)
    const getBrandDetailsQuery = `
        SELECT brand_id, amount, blockchain_address, brand_name, brand_representative, brand_rep_id
        FROM tokenRequests
        WHERE request_id = $1
    `;
    const brandDetailsResult = await pool.query(getBrandDetailsQuery, [
      requestId,
    ]);
    const {
      brand_id,
      amount,
      blockchain_address,
      brand_name,
      brand_representative,
      brand_rep_id,
    } = brandDetailsResult.rows[0];

    // Insert into ProcessedTokenRequest table
    const insertProcessedTokenRequestQuery = `
      INSERT INTO processedtokenrequest (request_id, brand_id, brand_name, brand_representative, brand_rep_id, blockchain_address, amount, txhash, processed_on)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, DEFAULT)
    `;
    await pool.query(insertProcessedTokenRequestQuery, [
      requestId,
      brand_id,
      brand_name,
      brand_representative,
      brand_rep_id,
      blockchain_address,
      amount,
      txHash,
    ]);

    // Send a success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating tables:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
