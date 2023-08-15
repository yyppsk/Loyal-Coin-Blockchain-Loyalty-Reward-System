// register.js

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.querySelector("form");

  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.querySelector("#fullname").value;
    const brandName = document.querySelector("#brandname").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const brandProfilePicInput = document.querySelector("#brandprofilepic");
    const brandRepProfilePicInput = document.querySelector(
      "#brandrepprofilepic"
    );

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("brandName", brandName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("brandProfilePic", brandProfilePicInput.files[0]); // Append the uploaded files
      formData.append("brandRepProfilePic", brandRepProfilePicInput.files[0]); // Append the uploaded files

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        // Registration successful
        window.location.href = "/brandlogin";
      } else {
        const responseData = await response.json();
        console.error("Registration failed:", responseData.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  });
});
