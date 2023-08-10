document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const brandName = registrationForm.brandName.value;
    const logoFile = registrationForm.logo.files[0];
    const programDetails = registrationForm.programDetails.value;

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("logo", logoFile);
    formData.append("programDetails", programDetails);

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = `./dashboard.html?brand=${brandName}`;
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  });
});
