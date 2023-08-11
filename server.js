const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg"); // Import the pg Pool module
const app = express();
const port = 3000;
app.use(cors());
app.use(express.static("public"));
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Use the necessary middleware
app.use(cookieParser());
app.use(
  session({
    secret: "61951e5393c6fe4a0d1c9caae67c8847cffdf99f2850274c20201894ddecccd0", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  })
);

//For the stuff that's going on with registering a brand
// Import API modules

const brandLoginRouter = require("./brandLoginRouter");

app.use("/api", brandLoginRouter);

const nonSequelizeApi = require("./nonSequelizeApi");
const sequelizeApi = require("./sequelizeApi");

// Use API modules
app.use("/api/non-sequelize", nonSequelizeApi);
app.use("/api/sequelize", sequelizeApi);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "loyaltycoinsystem",
  password: "pranjal",
  port: 5432,
}); // Create a new pool for PostgreSQL database connections

//const Brand = require("./models/Brands"); // Import the Sequelize mode

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

//<-- Handling the storage of Media - Specifically the brandlogo upload here -->

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const brandName = req.body.brandName;
    const brandDirectory = path.join(__dirname, "public", "assets", brandName);
    fs.mkdirSync(brandDirectory, { recursive: true });
    cb(null, brandDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//app.use(express.json());

app.post("/register", upload.single("logo"), async (req, res) => {
  const brandName = req.body.brandName;
  const representativeName = req.body.representativeName;
  const logoPath = `/assets/${brandName}/${req.file.filename}`;
  const email = req.body.email;
  const password = req.body.password;
  try {
    let client = await pool.connect(); // Acquire a client connection from the pool
    client = await pool.connect(); // Acquire a client connection from the pool);

    // Begin a transaction
    await client.query("BEGIN");

    // Insert brand data into the "Brands" table
    const brandInsertResult = await client.query(
      "INSERT INTO Brands (name, description, email, password, logo_path) VALUES ($1, $2, $3, $4, $5) RETURNING brand_id",
      [brandName, "", email, password, logoPath]
    );

    const brandId = brandInsertResult.rows[0].brand_id;

    // Insert brand representative data into the "BrandRepresentatives" table
    await client.query(
      "INSERT INTO BrandRepresentatives (brand_id, email, password, name) VALUES ($1, $2, $3, $4)",
      [brandId, email, password, representativeName]
    );

    // Commit the transaction
    await client.query("COMMIT");

    // Release the client connection back to the pool
    client.release();

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");

    res.status(500).json({ error: "Error registering brand" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
