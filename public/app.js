const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// Convert token balance to points
function convertToPoints(tokenBalance) {
  // Conversion ratio: 1 FKC = 100 points
  const conversionRatio = 100;
  return tokenBalance / conversionRatio;
}
let txHashReturning;
// Example: Get the latest block number
web3.eth
  .getBlockNumber()
  .then((blockNumber) => {
    console.log("Latest block number:", blockNumber);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

document.addEventListener("DOMContentLoaded", async () => {
  let provider;

  if (typeof web3 !== "undefined") {
    provider = web3.currentProvider;
  } else {
    alert("Please install MetaMask or use a compatible browser.");
  }

  const contractAddress = "0xbA1DC9d7A26F2a81625eBD5f34Bb3EBfE6B30D87";
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
  ]; // Replace with your contract's ABI
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  //Important Dependency for Transfer
  const userAddress = accounts[0];
  const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
  const globecontractAddress = "0xbA1DC9d7A26F2a81625eBD5f34Bb3EBfE6B30D87";

  // Function to transfer tokens
  async function transferTokens(amount, toAddress) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];
      const txParams = {
        to: globecontractAddress,
        from: userAddress,
        data: contractInstance.methods.transfer(toAddress, amount).encodeABI(),
      };

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });
      console.log("Transfer transaction hash:", txHash);

      updateBalance(userAddress); // Update the balance after transfer
      return { success: true, txHash }; // Return success and txHash
    } catch (error) {
      console.error("Error transferring tokens:", error);
      return { success: false, error };
    }
  }
  async function updateBalance(userAddress) {
    try {
      const balance = await contractInstance.methods
        .balanceOf(userAddress)
        .call();

      // Convert the balance from wei to FKC format
      const balanceInFKC = web3.utils.fromWei(balance, "ether");
      const balancehtml = `
      <div class="flex flex-col items-center space-x-4">
      <img class="w-16 h-16 rounded-full" src="./images/logo/loyalCoinToken_small.png" alt="">
      <div class="text-center sm:text-center break-all font-medium dark:text-white">
          <div >TotalLCS</div>
          <div class="text-gray-500 dark:text-gray-400">${balanceInFKC}</div>
      </div>
    </div>
  
      `;
      const loaderHtml = document.getElementById("totalLCS");
      loaderHtml.innerHTML = balancehtml;
      //document.getElementById("balance").textContent = balanceInFKC;
      //Displaying who's logged in via metamask
      //document.getElementById("loggedin").textContent = userAddress;
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  }

  updateBalance(userAddress);

  //Transfer the Token to any Account X

  //Update Tables for Each Successful transaction
  async function updateTables(requestId, txHash) {
    try {
      const response = await fetch("/updateTables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          txHash,
        }),
      });

      return response.json();
    } catch (error) {
      console.error("Error updating tables:", error);
      return { success: false };
    }
  }
  // Function to transfer tokens
  async function transferTokens(amount, toAddress) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];
      const txParams = {
        to: globecontractAddress,
        from: userAddress,
        data: contractInstance.methods.transfer(toAddress, amount).encodeABI(),
      };

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });
      console.log("Transfer transaction hash:", txHash);

      // Set up a listener to monitor the transaction confirmation
      const receipt = await waitForTransactionConfirmation(txHash);

      // Check if the receipt is not null, indicating transaction confirmation
      if (receipt !== null) {
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        // Update the balance after transfer
        updateBalance(userAddress);

        // Return success and transaction hash
        return { success: true, txHash };
      } else {
        console.log("Transaction is still pending");
        return { success: false };
      }
    } catch (error) {
      console.error("Error transferring tokens:", error);
      return { success: false };
    }
  }

  // Function to wait for transaction confirmation
  async function waitForTransactionConfirmation(txHash) {
    while (true) {
      try {
        const receipt = await ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        });

        if (receipt !== null) {
          return receipt;
        }

        // Wait for a few seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error("Error getting transaction receipt:", error);
        return null;
      }
    }
  }

  document
    .getElementById("redeemButton")
    .addEventListener("click", async () => {
      try {
        const amountToRedeem = 50; // Specify the amount of tokens to redeem
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];
        const txParams = {
          to: contractAddress,
          from: userAddress,
          data: contractInstance.methods
            .redeemTokens(amountToRedeem)
            .encodeABI(),
        };

        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams],
        });
        console.log("Redeem transaction hash:", txHash);

        updateBalance();
      } catch (error) {
        console.error("Error redeeming tokens:", error);
      }
    });

  document
    .getElementById("transferButton")
    .addEventListener("click", async () => {
      try {
        const toAddress = document.getElementById("toAddress").value;
        const amount = document.getElementById("transferAmount").value;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];
        const txParams = {
          to: contractAddress,
          from: userAddress,
          data: contractInstance.methods
            .transfer(toAddress, amount)
            .encodeABI(),
        };

        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams],
        });
        console.log("Transfer transaction hash:", txHash);

        updateBalance();
      } catch (error) {
        console.error("Error transferring tokens:", error);
      }
    });

  // An event listener to the document to handle the click event on the transfer buttons
  document.addEventListener("click", async (event) => {
    // Checking if the clicked element is a transfer button
    if (event.target.matches('[id^="fullFillRequest-"]')) {
      function simulateButtonClick() {
        const button = document.querySelector("#modalTriggerTransfer");
        if (button) {
          button.click();
        }
      }
      simulateButtonClick();
      // Get the request_id from the button's id
      const requestId = event.target.id.split("-")[1];
      // Extract the request details from the listItem
      const amount = parseFloat(
        document.querySelector(`#amount-${requestId}`).textContent
      );
      const toAddress = document
        .querySelector(`#blockchain-address-${requestId}`)
        .textContent.trim()
        .replace("Address: ", "");

      // Call the transfer function with the extracted details and the contractAddress

      const transferResult = await transferTokens(amount, toAddress);

      //Initialized the transfer
      const InitiatedTransferHtml =
        document.querySelector("#initiatedTransfer");

      const blockchainConfirmationHtml = document.querySelector(
        "#blockchainConfirmation"
      );
      const transferredFinalHtml = document.querySelector("#transferredFinal");
      const confirmedHtml = document.querySelector("#confirmed");

      const destinationuserHtml = document.querySelector("#destination-user");
      const transactionButtonHtml = document.querySelector(
        "#transactionButton-html"
      );

      //Initialized the transfer confirmation marking Check
      InitiatedTransferHtml.innerHTML = `<svg
          class="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>`;

      //Calling API from here if the process is succesful for transferring the tokens
      //via admin panel
      if (transferResult.success) {
        const apiResponse = await updateTables(
          requestId,
          transferResult.txHash
        );
        if (apiResponse.success) {
          // Update the list item status
          //document.querySelector(`#status-${requestId}`).textContent =
          //"Processed";
          blockchainConfirmationHtml.innerHTML = `<svg
          class="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>`;
          transferredFinalHtml.innerHTML = `<svg
          class="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>`;

          confirmedHtml.innerHTML = `<span
          class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-4 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
        >
            Confirmed
        </span>`;

          destinationuserHtml.innerHTML = `${toAddress}`;
          transactionButtonHtml.innerHTML = `<a href="./superadmin">
          <button
            id="transactionButton"
            data-modal-hide="defaultModal"
            type="button"
            class="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              role="status"
              class="inline w-4 h-4 mr-3 text-gray-200 dark:text-green-600"
              viewBox="0 0 20 20"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="green"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              />
            </svg>
            Transaction Successful
          </button>
        </a>`;
        } else {
          //Transfer fails surely
          transferredFinalHtml.innerHTML = `<svg
            class="w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-red-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>`;
          ////if blockchain fails final is failed
          confirmedHtml.innerHTML = `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-4 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">  Failed</span>`;
          destinationuserHtml.innerHTML = ` failed for ${toAddress}`;
          console.error("Error updating tables");
        }
      } else {
        //Cross & Failed
        //if blockchain fails show error
        blockchainConfirmationHtml.innerHTML = `<svg
        class="w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-red-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>`;
        //Transfer fails surely
        transferredFinalHtml.innerHTML = `<svg
        class="w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-red-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>`;
        ////if blockchain fails final is failed
        confirmedHtml.innerHTML = `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-4 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">  Failed</span>`;
        destinationuserHtml.innerHTML = ` failed for ${toAddress}`;
      }
    } else {
      //Initial fail
      InitiatedTransferHtml.innerHTML = `<svg
        class="w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-red-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>`;

      blockchainConfirmationHtml.innerHTML = `<svg
        class="w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-red-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>`;

      //Transfer fails surely
      transferredFinalHtml.innerHTML = `<svg
        class="w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-red-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>`;
      ////if blockchain fails final is failed
      confirmedHtml.innerHTML = `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-4 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">  Failed</span>`;
      destinationuserHtml.innerHTML = ` failed for ${toAddress}`;
    }
  });

  if (!isReturningUser) {
    // Runs only if they are brand new, or have hit the disconnect button
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  }
});
