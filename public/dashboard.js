document.addEventListener("DOMContentLoaded", () => {
  const brandLogo = document.getElementById("brandLogo");
  const programDetails = document.getElementById("programDetails");
  const balanceSpan = document.getElementById("balance");
  const customizeButton = document.getElementById("customizeButton");

  // Retrieve brand name from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const brandName = urlParams.get("brand");

  // Load brand data from the local JSON file (temporary database)
  fetch("./brands.json")
    .then((response) => response.json())
    .then((brands) => {
      const brandData = brands[brandName];
      if (brandData) {
        // Display brand details
        brandLogo.src = brandData.logoPath;
        programDetails.textContent = brandData.programDetails;

        customizeButton.addEventListener("click", () => {
          // Redirect to customization page or perform customization actions
        });
      } else {
        alert("Brand not found.");
      }
    });
});
