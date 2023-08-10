document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("register-form");

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const brandName = registrationForm.brandName.value;
    const logoFile = registrationForm.logo.files[0];
    console.log(logoFile);
    const name = registrationForm.name.value;
    const email = registrationForm.email.value;
    const password = registrationForm.pass.value;

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("logo", logoFile);
    formData.append("representativeName", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = `./dashboard.html?brand=${brandName}&email=${email}`;
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  });
});
