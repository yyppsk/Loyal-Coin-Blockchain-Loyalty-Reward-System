//Token request function
// Global variables
let brandId = 0;
let brand_rep_id = 0;
// Token request function
document.addEventListener("DOMContentLoaded", () => {
  const requestTokensForm = document.getElementById("requestTokensForm");

  requestTokensForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = parseInt(document.getElementById("amount").value);

    try {
      const response = await fetch("/api/requestTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          brandId,
          brand_rep_id, // Add brand_rep_id
          pending: false, // Set the request as not pending
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Token request sent successfully. Waiting for approval.");
        } else {
          alert("Failed to send token request. Please try again.");
        }
      } else {
        alert("Failed to send token request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending token request:", error);
      alert("An error occurred while sending token request.");
    }
  });
});

//Login Check
async function checkLoggedIn() {
  try {
    const response = await fetch("/api/check-auth");
    const data = await response.json();
    if (!data.isAuthenticated) {
      alert("Please log in before requesting tokens.");
      window.location.href = "./brandlogin"; // Redirect to login page
    } else {
      // User is logged in, proceed with token request form setup
      (async () => {
        try {
          // Fetch user data from the server
          const response = await fetch(
            "http://localhost:3000/api/auth/userdata",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // Include cookies for session management
            }
          );

          if (response.ok) {
            const { user, brandData } = await response.json();

            //For Request modification
            brandId = brandData.brand_id;
            brand_rep_id = user.representative_id;

            //For Html modofication
            const brand_rep_name = document.getElementById("brand_rep_name");
            const avatar = document.getElementById("current_user");
            //console.log(brand_rep_name);
            const avatarHtml = `<div class="relative">
                      <img src=".${user.brand_rep_profile_image}" class="h-10 w-10 rounded-full" alt="User"/>
                      <span class="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  </div>
                  `;
            avatar.innerHTML = avatarHtml;

            const userDataHTML = `${user.name}`;
            brand_rep_name.innerHTML = userDataHTML;
          } else {
            alert("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("An error occurred while fetching user data");
        }
      })();
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
}

// Call the checkLoggedIn function when the page loads
window.onload = checkLoggedIn;
