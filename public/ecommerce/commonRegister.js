async function checkAuthAndRedirect() {
  try {
    const response = await fetch('/api/check-auth-common', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.isAuthorized) {
        window.location.href = '/brandsdisplay'; // Redirect to brandsdisplay if authorized
      }
      // If not authorized, stay on the page
    } else {
      console.error('Error checking authentication');
    }
  } catch (error) {
    console.error(error);
  }
}

// Call the function when the page loads
window.addEventListener('load', checkAuthAndRedirect);

// Assuming you have a form element with the id "registration-form"
document.addEventListener('DOMContentLoaded', () => {
const registrationForm = document.querySelector('#registration');
registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission
  // Collect form data
  const formData = new FormData(registrationForm);
  const userData = {
    name: formData.get('full-name'),
    email: formData.get('email'),
    password: formData.get('password'),
    address: formData.get('address'),
    contact_details: formData.get('contact_details'),
  };

  try {
    // Send a POST request to the registration API endpoint
    const response = await fetch('/api/registercommon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      // Registration successful
      swal.fire({
        title: 'Registration Successful!',
        text: 'Welcome aboard!',
        icon: 'success',
      }).then(() => {
        // Redirect to login page
        window.location.href = '/commonlogin'; // Change to the actual login page URL
      });
      //console.log('Registration successful:', responseData.message);
      // You can also clear the form fields or perform other actions here
    } else {
      // Registration failed
      // Registration failed
      swal.fire({
        title: 'Registration Failed',
        text: responseData.message,
        icon: 'error',
      });
      // Registration failed, handle the error response
      //console.error('Registration failed:', responseData.message);
    }
  } catch (error) {
    console.error(error);
  }
});
});