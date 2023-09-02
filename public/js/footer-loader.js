// navbar-loader.js
document.addEventListener("DOMContentLoaded", function () {
  const navbarPlaceholder = document.getElementById("footer-placeholder");

  // Fetch the content of navbar.html
  fetch("/partials/footer.html")
    .then((response) => response.text())
    .then((html) => {
      // Insert the content into the placeholder
      navbarPlaceholder.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});
