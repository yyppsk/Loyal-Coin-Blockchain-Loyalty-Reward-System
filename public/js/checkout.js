document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/fetchCartItems');
       
            // Fetch user info (token balance and blockchain address)
        const userInfoResponse = await fetch('/api/fetchUserInfo');
        const userInfo = await userInfoResponse.json();


      if (response.ok) {;
        const cartItems = await response.json(); // Parse the response body
        console.log(cartItems);
        // Display cart items and calculate total price
        const cartContainer = document.querySelector('#cart-items');
        let totalPrice = 0;
  
        cartItems.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.textContent = `${item.name} - ${item.quantity} x ₹${item.cost}`;
          cartContainer.appendChild(itemDiv);
          totalPrice += item.quantity * item.cost;
        });
        
        // Display user's token balance and blockchain address
        const tokenBalanceContainer = document.querySelector('#token-balance');
        tokenBalanceContainer.textContent = `Available Tokens: ${userInfo.token_balance}`;

        const blockchainAddressContainer = document.querySelector('#blockchain-address');
        blockchainAddressContainer.textContent = `Blockchain Address: ${userInfo.blockchain_address}`;
    
        // Display total price
        const totalContainer = document.querySelector('#total-price');
        totalContainer.textContent = `Total Price: ₹${totalPrice.toFixed(2)}`;
  
        // Apply Token Discount button functionality
        const applyDiscountButton = document.querySelector('#apply-discount');
        applyDiscountButton.addEventListener('click', () => {
        const tokenDiscount = parseFloat(prompt('Enter token discount'));
        if (!isNaN(tokenDiscount)) {
            totalPrice -= tokenDiscount;
            totalContainer.textContent = `Total Price after Discount: ₹${totalPrice.toFixed(2)}`;
        }
        });
        
        // Place Order button functionality
        const placeOrderButton = document.querySelector('#place-order');
        placeOrderButton.addEventListener('click', async () => {
          // Construct the order data and send it to the server using an API
          const orderData = {
            cartItems: cartItems,
            tokenDiscount: tokenDiscount, // You need to declare tokenDiscount before this
            totalPrice: totalPrice,
          };
  
          const response = await fetch('/api/placeOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
  
          if (response.ok) {
            // Order placed successfully, redirect to confirmation page
            window.location.href = '/confirmation';
          } else {
            console.error('Error placing order');
          }
        });
      } else {
        console.error('Error fetching cart items');
      }
    } catch (error) {
      console.error(error);
    }
  });
  