// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MyToken
 * @notice ERC20 token with burn, mint, max supply and role-based access control.
 */

contract MyToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public immutable maxSupply;

    error MyToken__ZeroAddress();
    error MyToken__MaxSupplyExceeded();
    error MyToken__AmountMustBeGreaterThanZero();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) {
        if (maxSupply_ == 0) {
            revert MyToken__MaxSupplyExceeded();
        }

        uint256 scaledInitialSupply = initialSupply_ * 10 ** decimals();
        uint256 scaledMaxSupply = maxSupply_ * 10 ** decimals();

        if (scaledInitialSupply > scaledMaxSupply) {
            revert MyToken__MaxSupplyExceeded();
        }

        maxSupply = scaledMaxSupply;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _mint(msg.sender, scaledInitialSupply);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) {
            revert MyToken__ZeroAddress();
        }
        if (amount == 0) {
            revert MyToken__AmountMustBeGreaterThanZero();
        }
        if (totalSupply() + amount > maxSupply) {
            revert MyToken__MaxSupplyExceeded();
        }

        _mint(to, amount);
    }
}