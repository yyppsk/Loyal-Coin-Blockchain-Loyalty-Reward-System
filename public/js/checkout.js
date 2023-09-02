
document.addEventListener('DOMContentLoaded', async () => {
    let globalUser;
    const contractAddress = "0xbA1DC9d7A26F2a81625eBD5f34Bb3EBfE6B30D87";
    // actual LCS token contract ABI
    const contractABI = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "InvalidShortString",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "str",
              type: "string",
            },
          ],
          name: "StringTooLong",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "EIP712DomainChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "TokensEarned",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "TokensRedeemed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "DOMAIN_SEPARATOR",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "MINTER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "PAUSER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burnFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "subtractedValue",
              type: "uint256",
            },
          ],
          name: "decreaseAllowance",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "eip712Domain",
          outputs: [
            {
              internalType: "bytes1",
              name: "fields",
              type: "bytes1",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "version",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "verifyingContract",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
            {
              internalType: "uint256[]",
              name: "extensions",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "addedValue",
              type: "uint256",
            },
          ],
          name: "increaseAllowance",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "nonces",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "permit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "earnTokens",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "redeemTokens",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ]; 

    //Main Cart handling
    try {
        const response = await fetch('/api/fetchCartItems');
       
            // Fetch user info (token balance and blockchain address)
        const userInfoResponse = await fetch('/api/fetchUserInfo');
        const userInfo = await userInfoResponse.json();


      if (response.ok) {
        const cartResponse = await fetch('/api/fetchCartItems');
        
        if (!cartResponse.ok) {
        throw new Error('Error fetching cart items');
        }

        const { user_id, cartItems } = await cartResponse.json();
        globalUser = user_id;
        //console.log('User ID:', user_id);
        //console.log('Cart Items:', cartItems);
        // Display cart items and calculate total price
        const cartContainer = document.querySelector('#cart-items');
        let totalPrice = 0;
        
          
        cartItems.forEach(item => {
            const allItems = document.getElementById("all-items-handle");
            const maindiv = document.createElement('div');
            const itemDiv = document.createElement('div');
            const itemDiv2 = document.createElement('div');
            maindiv.setAttribute('id',`prod-handle-${item.product_id}`);
            itemDiv2.innerHTML = `
            
            <div class="flex items-center space-x-2 mb-2 mt-2">
              <input type="number" id="quantity-${item.product_id}" value="${item.quantity}" min="1" class="border rounded-md py-1 px-2 w-16">
              <button onclick="updateQuantity(${item.product_id})" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md">Update</button>
              <button onclick="removeFromCart(${item.product_id})" class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md">Remove</button>
            </div>
          `;
            itemDiv.innerHTML = `${item.name} - <span id="qty-dynamic-${item.product_id}"> ${item.quantity} </span> x ₹${item.cost}`;
            allItems.appendChild(maindiv);
            maindiv.appendChild(itemDiv);
            maindiv.appendChild(itemDiv2);
            totalPrice += item.quantity * item.cost;
          });

          

          
        // Display user's token balance and blockchain address
        const tokenBalanceContainer = document.querySelector('#token-balance');
        tokenBalanceContainer.textContent = `Available Tokens: ${userInfo.token_balance}`;
        
        
        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
        web3.eth
        .getBlockNumber()
        .then((blockNumber) => {
            console.log("Latest block number:", blockNumber);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        if (typeof web3 !== "undefined") {
            provider = web3.currentProvider;
         
            try {
            //  LCS token contract address
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            
            // Instance of the LCS token contract
            //Important Dependency for Transfer
            const currentAccount = accounts[0];
            const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
            const blockchainAddressContainer = document.querySelector('#blockchain-address');
            blockchainAddressContainer.textContent = `Blockchain Address: ${accounts[0]}`;
             // Function to fetch user's LCS token balance
            async function fetchUserBalance(userAddress) {
                try {
                    const balance = await contractInstance.methods.balanceOf(userAddress).call();
                    return balance;
                } catch (error) {
                    console.error("Error fetching user balance:", error);
                    return "N/A";
                }
            }

            async function updateBalance(userAddress) {
                try {
                  const balance = await contractInstance.methods
                    .balanceOf(userAddress)
                    .call();
            
                  // Convert the balance from wei to FKC format
                  const balanceInLCS = web3.utils.fromWei(balance, "ether");
                  const balancehtml = `
                  <div class="flex flex-col items-center space-x-4">
                  <img class="w-16 h-16 rounded-full" src="./images/logo/loyalCoinToken_small.png" alt="">
                  <div class="text-center sm:text-center break-all font-medium dark:text-white">
                      <div >TotalLCS</div>
                      <div class="text-gray-500 dark:text-gray-400">${balanceInLCS}</div>
                  </div>
                </div>
              
                  `;
                  const loaderHtml = document.querySelector("#token-LCS");
                  loaderHtml.innerHTML = balancehtml;
                  console.log(balanceInLCS)
                  document.querySelector("#token-INR").innerHTML =  balanceInLCS * 0.60000 * 132000.53 * 1000000000000000;

                } catch (error) {
                  console.error("Error updating balance:", error);
                }
              }
             
              async function main() {
              const userAddress = currentAccount;
              updateBalance(userAddress);
              // Fetch user's LCS token balance and update the HTML element
                const userBalance = await fetchUserBalance(currentAccount);
                document.querySelector('#token-LCS').textContent = userBalance;
  
              const balanceWei = await web3.eth.getBalance(currentAccount);
  
              document.querySelector('#token-WEI').textContent = balanceWei;
  
              const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
              
              document.querySelector('#token-ETH').textContent = balanceEth;
              document.querySelector('#LCStoINR').textContent = 79.2003180;
              document.querySelector('#SQLtoken-INR').textContent = (userInfo.token_balance * 0.6 * 132000.53) / 1000 ;
            }
            main();            
                } catch (error) {
                    console.error(error);
                }
            } else {
                alert("Please install MetaMask or use a compatible browser.");
             }

            // Display total price
            const totalContainer = document.querySelector('#total-price');
            totalContainer.textContent = `Total Price: ₹${totalPrice.toFixed(2)}`;
    
            // Calculate the maximum discount amount
            //const maxDiscountAmount = Math.min(totalPrice, (userInfo.token_balance * 0.6 * 132000.53) / 1000 );

            ethToInrRate = (userInfo.token_balance  * 0.6 * 132000.53) / 100000;

            // Apply Token Discount button functionality

            let leftoverlcs = userInfo.token_balance;

            const applyDiscountButton = document.querySelector('#apply-discount');
            applyDiscountButton.addEventListener('click', async () => {
                const tokenDiscount = parseFloat(prompt(`Enter token discount (Max: ${userInfo.token_balance} LCS)`));
                if(!isNaN(tokenDiscount) && tokenDiscount < 0){
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Discount Amount',
                        text: 'Please enter a valid discount amount within the available tokens range.',
                      });
                }
                if (!isNaN(tokenDiscount) && tokenDiscount >= 0 && tokenDiscount <= userInfo.token_balance) {
                // Calculate the actual discount in INR
                const discountInr = tokenDiscount * ethToInrRate;

                // Subtract the discount from the total price
                let ogTotalPrice = totalPrice;
                totalPrice -= discountInr;
                if (totalPrice < 0) {
                    if((tokenDiscount * ethToInrRate) >  ogTotalPrice){
                        tokenBalanceContainer.textContent = `Available Tokens: ${(tokenDiscount * ethToInrRate - ogTotalPrice ) / ethToInrRate}`;
                        leftoverlcs = (tokenDiscount * ethToInrRate - ogTotalPrice ) / ethToInrRate;

                        
    
                        const userAddress = userInfo.blockchain_address // User's Ethereum address
                        const tokensToBurn = leftoverlcs; // Quantity of tokens to burn

                        // Function to burn tokens
                        
                        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

                        // Function to burn tokens
                        async function burnTokens(userAddress, tokenAmount) {
                            try {
                                const accounts = await web3.eth.getAccounts();
                                const sender = accounts[0]; // Use the current Metamask account
                        
                                // Convert token amount to wei using web3.utils.toWei
                                const tokensInWei = web3.utils.toWei(tokenAmount.toString(), 'ether');
                        
                                // Estimate gas
                                const gas = await contractInstance.methods.burn(tokensInWei).estimateGas({ from: sender });
                        
                                // Send transaction to burn tokens
                                const tx = await contractInstance.methods.burn(tokensInWei).send({
                                    from: sender,
                                    gas: gas,
                                });
                        
                                console.log("Transaction hash:", tx.transactionHash);
                            } catch (error) {
                                console.error("Error burning tokens:", error);
                            }
                        }
                        
                        burnTokens(userAddress, tokensToBurn);
  









                        async function updateTokenBalance(userId, newTokenBalance) {
                            const apiUrl = '/api/updateTokenBalance'; // Replace with the actual API URL
                            console.log('i as ')
                            const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ userId, newTokenBalance }),
                            });
                        
                            if (response.ok) {
                            const data = await response.json();
                            return data;
                            } else {
                            const errorData = await response.json();
                            throw new Error(errorData.error);
                            }
                        }
                        updateTokenBalance(globalUser, leftoverlcs)
                            .then(response => {
                            console.log(response.message); // Print the success message
                            
                            })
                            .catch(error => {
                            console.error('Error:', error.message); // Print the error message
                            // Handle the error gracefully
                        });
                    }
                    
                    totalPrice = 0;
                    //console.log(globalUser)

                }
                else {
                    async function updateTokenBalance(userId, newTokenBalance) {
                        const apiUrl = '/api/updateTokenBalance'; // Replace with the actual API URL
                        
                        const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, newTokenBalance }),
                        });
                    
                        if (response.ok) {
                            tokenBalanceContainer.textContent = `Available Tokens: ${userInfo.token_balance - tokenDiscount}`;
                        const data = await response.json();
                        return data;
                        } else {
                        const errorData = await response.json();
                        throw new Error(errorData.error);
                        }
                    }
                    updateTokenBalance(globalUser, userInfo.token_balance - tokenDiscount)
                        .then(response => {
                        console.log(response.message); // Print the success message
                        
                        })
                        .catch(error => {
                        console.error('Error:', error.message); // Print the error message
                        // Handle the error gracefully
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Discount Applied Successfully',
                        text: 'Discount has been applied to your total price.',
                      });
                // Update the total price display
                totalContainer.textContent = `Total Price after Discount: ₹${totalPrice.toFixed(2)}`;
                }
             } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Discount Amount',
                        text: 'Please enter a valid discount amount within the available tokens range.',
                      });
                }
            });
            const payNowButton = document.querySelector('#pay-now');

            payNowButton.addEventListener('click', async () => {
              // Simulate payment process
              const paymentSuccessful = await simulatePayment(totalPrice);
          
              if (paymentSuccessful) {
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: 'Your payment has been successfully processed.',
                  }).then(() => {
                    window.location.href = '/successorder';
                  });
              } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: 'Payment could not be processed. Please try again.',
                  });
              }
            });

                        
            async function simulatePayment(amount) {
                // Simulate API call to process payment
                // In a real-world scenario, this would involve interacting with a payment gateway
                // For now, we'll just simulate a successful payment if the amount is greater than 0
                if (amount > 0) {
                return true;
                } else {
                return false;
                }
            }
      } else {
        // Display SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error Fetching Cart Items',
        text: 'There was an error fetching the cart items. Please try again later.',
      });
      }
    } catch (error) {
        // Display SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'An Error Occurred',
          text: 'An error occurred. Please try again later.',
        });
        console.error(error);
    }
  });



  // const options = {method: 'GET'};
// async function getConversionResult(curr) {
//     try {
//         const response = await fetch(`https://exchange-rates.abstractapi.com/v1/convert?api_key=b6bdded74ce8488ea603ef20d9a6eabf&base=ETH&target=INR&base_amount=${curr}`, options);
//         const data = await response.json();
//         const conversionResult = data.converted_amount;
//         conversionResult;
//         console.log(conversionResult);
//     } catch (error) {
//         console.error(error);
//     }
// }