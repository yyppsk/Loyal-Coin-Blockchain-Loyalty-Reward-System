const { Pool } = require("pg");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs");
// Create a PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "loyaltycoinsystem",
  password: "pranjal",
  port: 5432, // PostgreSQL default port
});

// Controller for handling Brand login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists in the database
    const userQuery = "SELECT * FROM brandrepresentatives WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);
    //console.log("User Query stuff ", userResult);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords (replace this with your authentication logic)
    const user = userResult.rows[0];
    const hashedPassword = user.password; // Get the hashed password from the database
    // Compare passwords using bcrypt
    console.log("Entered Password:", password);
    console.log("Hashed Password:", hashedPassword);
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Password Match:", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Set session after successful login
    //console.log("USER.ID BEFORE IF CONSTRUCT : ");

    req.session.userId = user.representative_id;

    //console.log(req.session.userId); Testing logs

    // Successful login
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

//
// Controller for getting Brand User's data
//

const getUserData = async (req, res) => {
  const userId = req.session.userId; // Get user ID from session
  // console.log(userId, req.session.userId); Test logs
  try {
    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Retrieve user data from the database
    const userQuery =
      "SELECT name, representative_id, brand_id ,brand_rep_profile_image, email FROM brandrepresentatives WHERE representative_id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];
    const brandId = user.brand_id;
    const userBrandQuery = "SELECT * FROM brands WHERE brand_id = $1";
    const userBrandQueryResult = await pool.query(userBrandQuery, [brandId]);
    // console.log(userBrandQueryResult);
    // Send back user data
    return res
      .status(200)
      .json({ user, brandData: userBrandQueryResult.rows[0] });
  } catch (error) {
    console.error("Get user data error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while getting user data" });
  }
};

//
// Controller for handling Brand's User registration
//

// Controller for handling user registration
const registerUser = async (req, res) => {
  const { fullName, brandName, email, password } = req.body;
  const brandProfilePic = req.files.brandProfilePic[0]; // Access the uploaded brand profile picture
  const brandRepProfilePic = req.files.brandRepProfilePic[0]; // Access the uploaded brand representative profile picture

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new brand in the database
    const brandQuery = `
      INSERT INTO Brands (name, email, password, logo_path)
      VALUES ($1, $2, $3, $4)
      RETURNING brand_id`;
    const brandResult = await pool.query(brandQuery, [
      brandName,
      email,
      hashedPassword,
      `/assets/${brandName}/${brandName}_logo.jpg`,
    ]);

    const brandId = brandResult.rows[0].brand_id;

    // Create a new brand representative in the database
    const brandRepQuery = `
      INSERT INTO BrandRepresentatives (name, brand_id, email, password, brand_rep_profile_image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING representative_id`;

    const firstName = fullName.split(" ")[0]; // Extract the first name from the full name
    await pool.query(brandRepQuery, [
      fullName,
      brandId,
      email,
      hashedPassword,
      `/assets/${brandName}/${firstName.toLowerCase()}_profile_pic.jpg`, // Use firstName (lowercase) instead of fullName
    ]);
    // Construct paths for saving profile pictures
    const brandProfilePicPath = path.join(
      __dirname,
      "..",
      "public",
      "assets",
      brandName,
      `${brandName}_logo.jpg`
    );
    const brandRepProfilePicPath = path.join(
      __dirname,
      "..",
      "public",
      "assets",
      brandName,
      `${firstName.toLowerCase()}_profile_pic.jpg`
    );

    // Move and save profile pictures
    fs.renameSync(brandProfilePic.path, brandProfilePicPath); // Move brand profile picture
    fs.renameSync(brandRepProfilePic.path, brandRepProfilePicPath); // Move brand representative profile picture

    // Handle success response
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export both functions as an object
module.exports = {
  loginUser,
  getUserData,
  registerUser,
};
