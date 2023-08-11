document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Send login credentials to the server for verification
      const response = await fetch("http://localhost:3000/api/brandlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        const data = await response.json();
        const brandName = data.brand ? data.brand.name : ""; // Get brand name from the response

        // Redirect to brand dashboard page with brand and email parameters
        const queryParams = new URLSearchParams();
        queryParams.append("brand", brandName);
        queryParams.append("email", email);
        const queryString = queryParams.toString();
        const dashboardUrl = `dashboard.html?${queryString}`;
        window.location.href = dashboardUrl;
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  });
});
