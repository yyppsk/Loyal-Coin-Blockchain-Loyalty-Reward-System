document.addEventListener("DOMContentLoaded", async () => {
  const brandLogo = document.getElementById("brandLogo");
  const brandNameHeading = document.getElementById("brandName");
  const representativeName = document.getElementById("representativeName");
  const customizeButton = document.getElementById("customizeButton");
  const rewardButton = document.getElementById("rewardButton");
  const redeemButton = document.getElementById("redeemButton");
  const Brand = require("./models/Brand");
  // Fetch brand representative and brand data from the server
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
      method: "GET",
      credentials: "include", // Include cookies for session management
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        // Display brand representative and brand details
        brandLogo.src = data.brand.logo_path;
        brandNameHeading.textContent = data.brand.name;
        representativeName.textContent = data.representative.name;

        customizeButton.addEventListener("click", () => {
          // Redirect to customization page or perform customization actions
        });

        rewardButton.addEventListener("click", () => {
          // Redirect to reward page or perform reward actions
        });

        redeemButton.addEventListener("click", () => {
          // Redirect to redeem page or perform redeem actions
        });
      } else {
        alert("Brand representative data not found.");
      }
    } else {
      alert("Error fetching brand representative data.");
    }
  } catch (error) {
    console.error("Error fetching brand representative:", error);
    alert("An error occurred during data fetching.");
  }
});
