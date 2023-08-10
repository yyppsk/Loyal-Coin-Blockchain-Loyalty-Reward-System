document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Load brand data from the local JSON file (temporary database)
    const response = await fetch("brands.json");
    const brands = await response.json();

    //console.log("Loaded brands:", brands);

    // Check if the email exists and password matches
    const brand = Object.values(brands).find((brand) => brand.email === email);
    //console.log("Selected brand:", brand);

    if (brand && brand.password === password) {
      // Redirect to brand dashboard page with brand and email parameters
      const queryParams = new URLSearchParams();
      queryParams.append("brand", brand.branding);
      queryParams.append("email", email);
      const queryString = queryParams.toString();
      const dashboardUrl = `dashboard.html?${queryString}`;
      window.location.href = dashboardUrl;
    } else {
      alert("Invalid email or password.");
    }
  });
});
