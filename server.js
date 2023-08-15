const express = require("express");
//const multer = require("multer");
//const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const pool = require("./db.js"); // Update the path to the db.js file

const session = require("express-session");
const cookieParser = require("cookie-parser");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./webpack.config"); // Update the path to your webpack.config.js
const bodyParser = require("body-parser"); // Import body-parser
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's URL
    credentials: true, // Allow cookies and session to be sent
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "61951e5393c6fe4a0d1c9caae67c8847cffdf99f2850274c20201894ddecccd0", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // Cookie expiration time in milliseconds
      httpOnly: true, // Cookie is only accessible via HTTP(S)
      secure: false, // Set to 'true' if using HTTPS
      sameSite: "strict", // Controls when cookies are sent
      name: "loyalcoin-session", // Set the session cookie name to "loyalcoin-session"
    },
  })
);
// Middleware
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the CSS file
app.use(
  "/style.css",
  express.static(path.join(__dirname, "public", "./css/style.css"))
);

app.get("/api/check-auth", (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.userId ? true : false;
  // Return authentication status
  res.json({ isAuthenticated });
});

// Use webpack-dev-middleware with your webpack configuration
const compiler = webpack(webpackConfig);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);
//For the stuff that's going on with registering a brand

// Use authRoutes for user authentication
app.use("/api/auth", authRoutes);

app.post("/api/updateBlockchainAddress", async (req, res) => {
  const { blockchainAddress } = req.body;
  const representativeId = req.session.userId; // Assuming you have stored the representative ID in the session
  try {
    // Check if the blockchain address is already present
    const checkQuery =
      "SELECT blockchain_address FROM brandrepresentatives WHERE representative_id = $1";
    const checkResult = await pool.query(checkQuery, [representativeId]);

    if (checkResult.rows.length > 0) {
      const blockchainAddress = checkResult.rows[0].blockchain_address;

      if (blockchainAddress !== null) {
        // User already has a blockchain address
        return res.json({
          success: false,
          message: "You already have a blockchain address assigned.",
        });
      }
    }

    // Proceed without a warning, since there is no address or the address is NULL

    // Update the blockchain address in the brandrepresentatives table
    try {
      const updateQuery =
        "UPDATE brandrepresentatives SET blockchain_address = $1 WHERE representative_id = $2";
      await pool.query(updateQuery, [blockchainAddress, representativeId]);
      // Update the blockchain address in the brands table (if needed)
      // Get the brand ID of the representative
      const brandIdQuery =
        "SELECT brand_id FROM brandrepresentatives WHERE representative_id = $1";
      const brandIdResult = await pool.query(brandIdQuery, [representativeId]);
      const brandId = brandIdResult.rows[0].brand_id;

      // Update the blockchain address in the brands table
      const updateBrandsQuery =
        "UPDATE brands SET blockchain_address = $1 WHERE brand_id = $2";
      await pool.query(updateBrandsQuery, [blockchainAddress, brandId]);

      return res.json({
        success: true,
        message: "Blockchain address updated successfully.",
      });
    } catch (error) {
      console.error("Error updating blockchain address:", error);
      //return res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error updating blockchain address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//const Brand = require("./models/Brands"); // Import the Sequelize mode
app.get("/dashboard2", (req, res) => {
  const filePath = path.join(__dirname, "public", "dashboard2.html");
  res.sendFile(filePath);
});
app.get("/registerwallet", (req, res) => {
  const filePath = path.join(__dirname, "public", "walletregister.html");
  res.sendFile(filePath);
});
app.get("/src", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/dashboard", (req, res) => {
  if (req.session.userId) {
    // console.log(req.session.userId); //Testing if the session is maintained
    // User is logged in, serve the dashboard HTML
    const filePath = path.join(__dirname, "public", "dashboard.html");
    res.sendFile(filePath);
  } else {
    // User is not logged in, redirect to the login page
    res.redirect("/brandlogin");
  }
});

// Route to serve the login.html page
app.get("/brandlogin", (req, res) => {
  const filePath = path.join(__dirname, "public", "login.html");
  res.sendFile(filePath);
});

// Route to serve the login.html page
app.get("/registerbrand", (req, res) => {
  const filePath = path.join(__dirname, "public", "register.html");
  res.sendFile(filePath);
});

// Route to handle the client request and return data for the balance of user
app.get("/getBalance", async (req, res) => {
  try {
    const userAddress = req.query.address; // Get user's address from the request
    const balance = await contractInstance.methods
      .balanceOf(userAddress)
      .call();
    // Convert balance from wei to FKC format
    const balanceInFKC = web3.utils.fromWei(balance, "ether");
    res.json({ balance: balanceInFKC });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Start the server
const PORT = process.env.PORT || 3001; // Use a different port than your webpack dev server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
