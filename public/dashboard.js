document.addEventListener("DOMContentLoaded", async () => {
  console.log("Stuff for dashboard");
  try {
    // Fetch user data from the server
    const response = await fetch("http://localhost:3000/api/auth/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for session management
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user;

      // Display user data in the dashboard
      const dashboardDataDiv = document.getElementById("dashboardData");
      const userDataHTML = `
        <p>${user.name}</p>
        <!-- Add more data fields as needed -->
      `;
      dashboardDataDiv.innerHTML = userDataHTML;
    } else {
      alert("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("An error occurred while fetching user data");
  }
});
