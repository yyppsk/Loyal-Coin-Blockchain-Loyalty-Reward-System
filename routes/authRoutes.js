const express = require("express");
const {
  loginUser,
  getUserData,
  registerUser,
} = require("../controllers/authController");
const multer = require("multer"); // Import multer (Do not alter)
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Route for brand user login
router.post("/login", loginUser);

// Route for brand user data fetching
router.get("/userdata", getUserData);

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const brandName = req.body.brandName;
    const brandDirectory = path.join(
      __dirname,
      "..",
      "public",
      "assets",
      brandName
    );
    fs.mkdirSync(brandDirectory, { recursive: true });
    cb(null, brandDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Route to handle user registration with multiple image uploads
router.post(
  "/register",
  upload.fields([
    { name: "brandProfilePic", maxCount: 1 },
    { name: "brandRepProfilePic", maxCount: 1 },
  ]),
  registerUser
);

module.exports = router;
