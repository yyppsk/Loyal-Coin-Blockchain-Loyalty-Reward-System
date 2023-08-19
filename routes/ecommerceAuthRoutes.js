const express = require("express");
const router = express.Router();

const authenticateCommonUser = (req, res, next) => {
  // Check if the user is logged in and is an e-commerce user
  if (req.session.isEcommerceUser && req.session.commonUser) {
    return next(); // User is authenticated, proceed to the next middleware or route
  } else {
    // User is not logged in or not authorized, redirect to the login page
    res.redirect("/login"); // Change '/login' to the actual login route
  }
};
