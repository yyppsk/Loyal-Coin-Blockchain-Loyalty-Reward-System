document.addEventListener("DOMContentLoaded", async () => {
  // Check if MetaMask is installed
  if (typeof window.ethereum !== "undefined") {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const userAddress = accounts[0];

    // Update logged-in user
    document.getElementById("loggedin").textContent = userAddress;

    // Fetch and update balance using app.js logic
    updateBalance(userAddress);
  } else {
    alert("Please install MetaMask or use a compatible browser.");
  }
});
