const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.static("public"));

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

app.use(express.json()); // Add this middleware to parse JSON requests

app.post("/register", upload.single("logo"), (req, res) => {
  const brandName = req.body.brandName;
  const representativeName = req.body.representativeName;
  const logoPath = `/assets/${brandName}/${req.file.filename}`;
  const email = req.body.email;
  const password = req.body.password;

  // Update JSON file
  const brandsPath = path.join(__dirname, "public/brands.json");
  let brandsData = {};

  if (fs.existsSync(brandsPath)) {
    const brandsFile = fs.readFileSync(brandsPath, "utf8");
    if (brandsFile.trim() !== "") {
      brandsData = JSON.parse(brandsFile);
    }
  }

  brandsData[brandName] = {
    branding: brandName, // Add the branding property
    logoPath,
    representativeName,
    email,
    password,
  };

  fs.writeFileSync(brandsPath, JSON.stringify(brandsData, null, 2));

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
