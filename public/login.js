document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const brandName = document.getElementById("brandName").value;

    // Load brand data from the local JSON file (temporary database)
    const response = await fetch("brands.json");
    const brands = await response.json();

    // Check if the brand exists
    if (brands[brandName]) {
      // Redirect to brand dashboard page
      window.location.href = `dashboard.html?brand=${encodeURIComponent(
        brandName
      )}`;
    } else {
      alert("Brand not found. Please register.");
    }
  });
});
