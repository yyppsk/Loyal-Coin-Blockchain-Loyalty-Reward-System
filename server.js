const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const multer = require("multer");
const authRoutes = require("./routes/authRoutes");
const pool = require("./db.js"); // Update the path to the db.js file
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./webpack.config"); // Update the path to your webpack.config.js
const bodyParser = require("body-parser"); // Import body-parser
const tokenController = require("./tokenController.js");
const tokenRequestsDataRouter = require("./tokenRequestsData.js");
const updateTablesRouter = require("./updateTables.js");
// const fileUpload = require("express-fileupload");
const brandsApi = require("./brands-fetch.js"); // Import the API router
const bcrypt = require("bcrypt");
const stripe = require("stripe")(
  "sk_test_51JN1E4SHC0onIwhSyeQElNAAvRLtAxqdP6ttXhHfoolgic5AfkuwLJb6QUcIKtkAv5fZFpOI1sglU1y7EOFbneov002A1y15KG"
);
//Middleware to increase the file size limit
// Middleware
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  bodyParser.json({
    limit: "10mb",
  })
); // Adjust the limit as needed
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
  })
); // Adjust the limit as needed

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

// Session middleware for e-commerce users
app.use(
  session({
    secret: "TOga36RgZP1a594g42wt0jze5dW8gRu9",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // Cookie expiration time in milliseconds
      httpOnly: true, // Cookie is only accessible via HTTP(S)
      secure: false, // Set to 'true' if using HTTPS
      sameSite: "strict", // Controls when cookies are sent
      name: "ecommerce-session", // Set the session cookie name for e-commerce users
    },
  })
);

app.get("/api/user-details", async (req, res) => {
  const sessionId = req.session.userId;
  console.log(sessionId);
  try {
    const client = await pool.connect();
    const query =
      "SELECT * FROM brandrepresentatives WHERE representative_id = $1";
    const result = await client.query(query, [sessionId]);
    const user = result.rows[0];
    client.release();

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/logoutbrand", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.sendStatus(200); // Send a successful response
  });
});
app.post("/api/payment", async (req, res) => {
  const { token, amount } = req.body;

  try {
    await stripe.charges.create({
      amount,
      currency: "inr", // Change this to your desired currency
      description: "Test Payment",
      source: token,
    });

    // Payment successful
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
//------LOGIC FOR HANDLING THE REQURIED UPLOADS TO ECOM BY BRANDS----------

// PUT (update) a product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    cost,
    discount,
    cost_in_tokens,
    quantity,
    tokens_reward,
    description,
    image_1,
    image_2,
    // Add other fields here
  } = req.body;

  const updateFields = {};

  if (name !== undefined) updateFields.name = name;
  if (category !== undefined) updateFields.category = category;
  if (cost !== undefined) updateFields.cost = cost;
  if (discount !== undefined) updateFields.discount = discount;
  if (cost_in_tokens !== undefined)
    updateFields.cost_in_tokens = cost_in_tokens;
  if (quantity !== undefined) updateFields.quantity = quantity;
  if (tokens_reward !== undefined) updateFields.tokens_reward = tokens_reward;
  if (description !== undefined) updateFields.description = description;
  if (image_1 !== undefined) updateFields.image_1 = image_1;
  if (image_2 !== undefined) updateFields.image_2 = image_2;
  // Add other fields here

  try {
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update",
      });
    }

    const updateQuery = {
      text: `UPDATE Products SET ${Object.keys(updateFields)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(", ")} WHERE product_id = $${
        Object.keys(updateFields).length + 1
      }`,
      values: Object.values(updateFields).concat(id),
    };

    await pool.query(updateQuery);

    res.json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred",
    });
  }
});

// DELETE a product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Products WHERE product_id = $1", [id]);
    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred",
    });
  }
});

/////////////////////////////////Store Front ////////////////////////////////
// API endpoint to fetch products for the StoreFront

app.get("/api/StoreAllproducts", async (req, res) => {
  const selectedBrand = req.query.brand;

  try {
    const query = `
      SELECT * FROM products
      WHERE brand_id = $1
      LIMIT 8
    `;
    const values = [selectedBrand];

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//API for handling the CART

app.post("/api/addToCart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const client = await pool.connect(); // Acquire a database connection

  try {
    // Start a transaction
    await client.query("BEGIN");

    // Check if the item is already in the user's cart
    const existingCartItem = await client.query(
      "SELECT quantity FROM Cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingCartItem.rows.length > 0) {
      // Update the existing cart item's quantity
      await client.query(
        "UPDATE Cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [existingCartItem.rows[0].quantity + quantity, user_id, product_id]
      );
    } else {
      // Insert the new cart item
      await client.query(
        "INSERT INTO Cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [user_id, product_id, quantity]
      );
    }

    // Commit the transaction
    await client.query("COMMIT");

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    // If an error occurs, rollback the transaction
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Release the database connection
    client.release();
  }
});

/////////////////////////////////Store Front End ////////////////////////////////

// API to check if the user is logged in and authorized
app.get("/api/check-auth-common", (req, res) => {
  const isAuthorized = req.session.isEcommerceUser && req.session.commonUser;

  res.json({
    isAuthorized,
    commonUser: req.session.commonUser,
  });
});
//Adding Products to Brands
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { brand_id, category, name } = req.body;
    const formattedName = name.replace(/\s+/g, "").substring(0, 20);
    const destinationPath = path.join(
      "public/ecommerce/assets",
      brand_id.toString(),
      category,
      formattedName
    );
    try {
      // Create the directory if it doesn't exist
      fs.mkdirSync(destinationPath, {
        recursive: true,
      });
      cb(null, destinationPath);
    } catch (error) {
      console.error("Error creating directory:", error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueId = Date.now();
    const extension = path.extname(file.originalname);
    const newFileName = `${uniqueId}${extension}`;
    cb(null, newFileName);
  },
});
const upload = multer({
  storage,
});

//Common User Registeration API
// API endpoint for user registration
app.post("/api/registercommon", async (req, res) => {
  try {
    const { name, email, password, address, contact_details } = req.body;

    // Check if the email is already registered
    const existingUser = await pool.query(
      "SELECT * FROM Users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user data into the database
    const newUser = await pool.query(
      "INSERT INTO Users (name, email, password, home_address, contact_details) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, address, contact_details]
    );

    res.json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Common User Login API
app.post("/api/commonlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to find the user with the provided email
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (passwordMatch) {
        // Set session data for the logged-in user
        req.session.commonUser = {
          id: user.rows[0].user_id,
          email: user.rows[0].email,
        };
        // Set a specific property to identify e-commerce users
        req.session.isEcommerceUser = true;

        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Common User logout

app.post("/api/commonlogout", (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging out" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

// Define the authenticateCommonUser middleware
const authenticateCommonUser = (req, res, next) => {
  if (req.session.isEcommerceUser && req.session.commonUser) {
    return next();
  } else {
    res.redirect("/commonlogin");
  }
};

app.get("/api/fetchUserInfo", authenticateCommonUser, async (req, res) => {
  const user_id = req.session.commonUser.id;

  try {
    const userInfo = await pool.query(
      "SELECT token_balance, blockchain_address FROM users WHERE user_id = $1",
      [user_id]
    );

    res.json(userInfo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/fetchCartItems", authenticateCommonUser, async (req, res) => {
  const user_id = req.session.commonUser.id; // Get the user ID from the session

  try {
    const cartItems = await pool.query(
      "SELECT products.*, cart.quantity FROM products JOIN cart ON products.product_id = cart.product_id WHERE cart.user_id = $1",
      [user_id]
    );

    res.json({
      user_id: user_id, // Include the user ID in the response
      cartItems: cartItems.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////////////////////STORE FRONT END - END //////////////////////////////
/////INVOICE//////////middleware

//Add Products to the database in Product table
app.post("/api/products", upload.array("images", 2), async (req, res) => {
  try {
    const {
      brand_id,
      name,
      category,
      cost,
      discount,
      cost_in_tokens,
      quantity,
      tokens_reward,
      description,
    } = req.body;
    // Modify the image paths before storing in the database
    const images = req.files.map((file) => file.path);
    const image1 = images[0].slice(7);
    const image2 = images[1].slice(7);
    //console.log(image1);
    // Insert product data into the database
    const query = `INSERT INTO products (brand_id, name, category, cost, discount, cost_in_tokens, quantity, tokens_reward, description, image_1, image_2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    const values = [
      brand_id,
      name,
      category,
      cost,
      discount,
      cost_in_tokens,
      quantity,
      tokens_reward,
      description,
      image1,
      image2,
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while adding the product.",
    });
  }
});

// API endpoint to fetch categories
app.get("/api/categories", (req, res) => {
  const query = "SELECT DISTINCT category FROM products";

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({
        error: "Internal server error",
      });
    }

    // Access the "rows" property to get the data array
    const categories = results.rows.map((row) => row.category);
    res.json(categories);
  });
});

//Get details of Products
app.get("/api/products", async (req, res) => {
  try {
    const query = "SELECT * FROM products";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching products.",
    });
  }
});
//Count Products
app.get("/api/productsCount", async (req, res) => {
  try {
    // Get the total number of rows in the Products table
    const countQuery = "SELECT COUNT(*) FROM products";
    const countResult = await pool.query(countQuery);
    const totalRows = parseInt(countResult.rows[0].count);

    res.status(200).json({
      totalRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching product count.",
    });
  }
});

//------LOGIC FOR HANDLING THE REQURIED UPLOADS TO ECOM-------
//Request Token Data
app.use("/api", tokenRequestsDataRouter);

// Serve the CSS file
app.use(
  "/style.css",
  express.static(path.join(__dirname, "public", "./css/style.css"))
);
// Use the updateTables router for the /updateTables route
app.use("/updateTables", updateTablesRouter);

app.get("/api/check-auth", (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.userId ? true : false;
  // Return authentication status
  res.json({
    isAuthenticated,
  });
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
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Ecommerce Routes

app.get("/api/fetchUserDetails", authenticateCommonUser, async (req, res) => {
  const user_id = req.session.commonUser.id;

  try {
    const userDetails = await pool.query(
      "SELECT name, email, contact_details, home_address FROM Users WHERE user_id = $1",
      [user_id]
    );

    res.json(userDetails.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update token balance for a user
app.post("/api/updateTokenBalance", (req, res) => {
  const { userId, newTokenBalance } = req.body;

  // Update the token_balance field in the users table
  const updateQuery = "UPDATE users SET token_balance = $1 WHERE user_id = $2";
  pool.query(updateQuery, [newTokenBalance, userId], (err, result) => {
    if (err) {
      console.error("Error updating token balance:", err);
      res.status(500).json({ error: "Failed to update token balance" });
    } else {
      console.log("Token balance updated successfully");
      res.json({ message: "Token balance updated successfully" });
    }
  });
});

app.get("/cart", (req, res) => {
  res.sendFile(__dirname + "/public/cart.html");
});

app.get("/checkout", (req, res) => {
  res.sendFile(__dirname + "/public/checkout.html");
});

app.get("/transactions", (req, res) => {
  res.sendFile(__dirname + "/public/transactions.html");
});
app.get("/commonlogin", (req, res) => {
  res.sendFile(__dirname + "/public/commonlogin.html");
});
app.get("/commonsignup", (req, res) => {
  res.sendFile(__dirname + "/public/commonsignup.html");
});

app.get("/store", (req, res) => {
  res.sendFile(__dirname + "/public/storefront.html");
});

app.get("/addproducts", (req, res) => {
  res.sendFile(__dirname + "/public/addproducts.html");
});

app.get("/addedproducts", (req, res) => {
  res.sendFile(__dirname + "/public/addedproducts.html");
});
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/public/t.html");
});
app.get("/brandsdisplay", (req, res) => {
  res.sendFile(__dirname + "/public/brands.html");
});
app.get("/successorder", (req, res) => {
  res.sendFile(__dirname + "/public/confirmation.html");
});
// Use the brands API
app.use("/api", brandsApi);

//dashboard 2
app.get("/superadmin", (req, res) => {
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

app.get("/requesttokens", (req, res) => {
  const filePath = path.join(__dirname, "public", "requesttokens.html");
  res.sendFile(filePath);
});
// Route to serve the login.html page
app.get("/brandlogin", (req, res) => {
  const filePath = path.join(__dirname, "public", "login.html");
  res.sendFile(filePath);
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

app.get("/superadmindata", async (req, res) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM super_admin WHERE superadmin = true LIMIT 1";
    const result = await client.query(query);
    const superadmin = result.rows[0];
    client.release();

    res.json(superadmin);
  } catch (error) {
    console.error("Error fetching superadmin details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//Route for request Tokens
app.post("/api/requestTokens", tokenController.requestTokens);

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
    res.json({
      balance: balanceInFKC,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//cart clear

app.delete("/api/clearCart", authenticateCommonUser, async (req, res) => {
  const user_id = req.session.commonUser.id;

  try {
    // Remove all items from the cart for the current user
    //todo -> add a logic to see if there are any items in the cart or not
    await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put(
  "/api/updateCartItemQuantity/:productId",
  authenticateCommonUser,
  async (req, res) => {
    const user_id = req.session.commonUser.id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {
      // Check if the item exists in the cart
      const cartItem = await pool.query(
        "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
        [user_id, productId]
      );

      if (cartItem.rows.length === 0) {
        return res.status(404).json({ error: "Item not found in the cart" });
      }

      // Update the item's quantity
      await pool.query(
        "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, user_id, productId]
      );

      res.json({ message: "Item quantity updated successfully" });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete(
  "/api/removeFromCart/:productId",
  authenticateCommonUser,
  async (req, res) => {
    const user_id = req.session.commonUser.id;
    const productId = req.params.productId;

    try {
      // Check if the item exists in the cart
      const cartItem = await pool.query(
        "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
        [user_id, productId]
      );

      if (cartItem.rows.length === 0) {
        return res.status(404).json({ error: "Item not found in the cart" });
      }

      // Remove the item from the cart
      await pool.query(
        "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
        [user_id, productId]
      );

      res.json({ message: "Item removed from cart successfully" });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Route to handle 404 errors
app.use((req, res, next) => {
  const filePath = path.join(__dirname, "public", "404.html");
  res.status(404).sendFile(filePath);
});

// Start the server
const PORT = process.env.PORT || 3001; // Use a different port than your webpack dev server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
