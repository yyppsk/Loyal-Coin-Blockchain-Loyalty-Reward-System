const form = document.getElementById("addProductForm");
const dropZone1 = document.getElementById("imageDropZone1");
const dropZone2 = document.getElementById("imageDropZone2");
const imageInput1 = document.getElementById("imageInput1");
const imageInput2 = document.getElementById("imageInput2");

// Prevent default behavior when dragging over the drop zones
dropZone1.addEventListener("dragover", handleDragOver);
dropZone2.addEventListener("dragover", handleDragOver);

// Handle dropping files onto the drop zones
dropZone1.addEventListener("drop", (e) => handleDrop(e, imageInput1));
dropZone2.addEventListener("drop", (e) => handleDrop(e, imageInput2));

// Open file dialog when the drop zones are clicked
dropZone1.addEventListener("click", () => openFileDialog(imageInput1));
dropZone2.addEventListener("click", () => openFileDialog(imageInput2));

// Handle drag over event
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("border-blue-500");
}

// Handle drop event
function handleDrop(e, inputElement) {
  e.preventDefault();
  e.currentTarget.classList.remove("border-blue-500");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    inputElement.files = files;
    updateDropZoneText(e.currentTarget, files.length + " image(s) selected");
    // Show image preview
    showImagePreview(inputElement);
  }
}

// Open file dialog
function openFileDialog(inputElement) {
  inputElement.click();
}

// Update drop zone text
function updateDropZoneText(dropZone, text) {
  dropZone.querySelector("p").textContent = text;
}

// Show image preview
function showImagePreview(inputElement) {
  const previewContainer = inputElement
    .closest(".drop-zone")
    .querySelector(".image-preview");
  previewContainer.innerHTML = "";
  const files = inputElement.files;
  for (const file of files) {
    const imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(file);
    imageElement.classList.add("w-32", "h-32", "object-cover", "m-2");
    previewContainer.appendChild(imageElement);
  }
}

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Product added:", data.product);
      // Show SweetAlert2 success message
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been successfully added.",
      });
      // Reset form and image previews
      form.reset();
      const previewContainers = document.querySelectorAll(".image-preview");
      previewContainers.forEach((container) => (container.innerHTML = ""));
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "SFailed to add product!",
        footer: '<a href="./support">Why do I have this issue?</a>',
      });

      console.error("Failed to add product");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="./support">Why do I have this issue?</a>',
    });

    console.error("An error occurred:", error);
  }
});
