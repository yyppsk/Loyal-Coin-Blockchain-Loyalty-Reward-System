
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
  
document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRedirect();
    const loginForm = document.querySelector('#login-form');
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      const formData = new FormData(loginForm);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
      };
  
      try {
        const response = await fetch('/api/commonlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          // Login successful
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome onboard!',
            timer: 1000, // Automatically close after 1 second
            showConfirmButton: false,
          }).then(() => {
            // Redirect to the storefront route after successful login
            window.location.href = '/brandsdisplay'; // Change to the actual storefront route
          });
        } else {
          // Login failed
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: responseData.message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
  