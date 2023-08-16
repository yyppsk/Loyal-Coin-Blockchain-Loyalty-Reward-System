const pool = require("./db");
//Logic for handling the API requests
async function requestTokens(req, res) {
  const { amount, brandId, brand_rep_id, pending } = req.body;

  try {
    // Retrieve brand representative information based on brand_rep_id
    const brandQuery =
      "SELECT name, blockchain_address FROM brands WHERE brand_id = $1";
    const brandResult = await pool.query(brandQuery, [brandId]);
    if (brandResult.rows.length === 0) {
      return res.json({
        success: false,
        message: "Brand not found",
      });
    }

    const brand_name = brandResult.rows[0].name;
    const blockchain_address = brandResult.rows[0].blockchain_address;
    // Retrieve brand information based on brandId
    const brandRepQuery =
      "SELECT name, email FROM brandrepresentatives WHERE representative_id = $1";
    const brandRepResult = await pool.query(brandRepQuery, [brand_rep_id]);

    if (brandRepResult.rows.length === 0) {
      return res.json({ success: false, message: "Brand Rep not found" });
    }

    const brandRepName = brandRepResult.rows[0].name;
    const brandRepEmail = brandRepResult.rows[0].email;

    console.log("Inserting token request into database:", {
      brandId,
      brand_name,
      brandRepName,
      brandRepEmail,
      brand_rep_id,
      blockchain_address,
      amount,
      pending,
    });

    const insertQuery = `
            INSERT INTO tokenrequests (brand_id, brand_name, brand_representative, brand_rep_email, brand_rep_id, blockchain_address, amount, pending)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
    await pool.query(insertQuery, [
      brandId,
      brand_name,
      brandRepName,
      brandRepEmail,
      brand_rep_id,
      blockchain_address,
      amount,
      pending,
    ]);

    return res.json({
      success: true,
      message: "Token request sent successfully. Waiting for approval.",
    });
  } catch (error) {
    console.error("Error sending token request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send token request. Please try again.",
    });
  }
}

module.exports = {
  requestTokens,
};
