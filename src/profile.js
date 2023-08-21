// Assuming the server is running on the same domain and port 3000
const url = "/api/user-details";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Assuming you have HTML elements with these IDs
    const profilepic = document.querySelector("#profile");

    // Populate HTML elements
    profilepic.innerHTML = `<img
    src="${data.brand_rep_profile_image}"
    alt="profile"
    style="border-radius : 50%;"
  />`;
    document.querySelector("#name_profile").innerHTML = data.name;
    document.querySelector("#email").innerHTML = data.email;
    document.querySelector("#created").innerHTML = data.created_at;
    document.querySelector("#updated").innerHTML = data.updated_at;
    document.querySelector("#blockchain").innerHTML = data.blockchain_address;
  })

  .catch((error) => {
    console.error("Error fetching data:", error);
  });
