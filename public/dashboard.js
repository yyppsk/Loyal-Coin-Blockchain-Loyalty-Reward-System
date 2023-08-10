document.addEventListener("DOMContentLoaded", () => {
  const brandLogo = document.getElementById("brandLogo");
  const brandNameHeading = document.getElementById("brandName");
  const balanceSpan = document.getElementById("balance");
  const customizeButton = document.getElementById("customizeButton");
  const rewardButton = document.getElementById("rewardButton");
  const redeemButton = document.getElementById("redeemButton");
  const representativeName = document.getElementById("representativeName");

  // Retrieve email from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  // Load brand data from the local JSON file (temporary database)
  fetch("./brands.json")
    .then((response) => response.json())
    .then((brands) => {
      let brandName = null;

      // Find the brand that matches the provided email
      for (const [key, value] of Object.entries(brands)) {
        if (value.email === email) {
          brandName = key;
          break;
        }
      }

      if (brandName) {
        const brandData = brands[brandName];
        // Display brand details
        brandLogo.src = brandData.logoPath;
        brandNameHeading.textContent = brandName;
        representativeName.textContent = `${brandData.representativeName}`; // Assuming the key is "representativeName" in brands.json

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
        alert("Brand not found for the provided email.");
      }
    });
});
