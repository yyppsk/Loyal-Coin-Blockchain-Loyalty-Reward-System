// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Flipkartcoin is ERC20, ERC20Burnable, Pausable, AccessControl, ERC20Permit {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Define events
    event TokensEarned(address indexed account, uint256 amount);
    event TokensRedeemed(address indexed account, uint256 amount);

    constructor() ERC20("flipkartcoin", "FKC") ERC20Permit("flipkartcoin") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 420420420420 * 10 ** decimals());
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function earnTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, amount);
        emit TokensEarned(msg.sender, amount);
    }

    function redeemTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Calculate the amount of rewards based on the redeemed tokens
        uint256 rewards = amount * 2; // Example: Each token gives 2 rewards

        // Transfer the rewards to the user
        _mint(msg.sender, rewards);

        // Burn the redeemed tokens
        _burn(msg.sender, amount);

        emit TokensRedeemed(msg.sender, amount);
    }
}
