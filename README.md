# ERC20 Access Control Token

A production-style ERC20 token smart contract built with Solidity, Hardhat, OpenZeppelin, and TypeScript.

---

## Features

- ERC20 token standard
- Mint functionality
- Burn functionality
- Role-based access control
- Max supply protection
- Custom Solidity errors
- Automated tests with Hardhat
- Sepolia testnet deployment
- Etherscan verified contract

---

## Tech Stack

- Solidity
- Hardhat
- OpenZeppelin
- TypeScript
- Ethers.js
- Mocha / Chai

---

## Smart Contract Features

### Minting

Only addresses with `MINTER_ROLE` can mint new tokens.

### Burning

Token holders can burn their own tokens.

### Access Control

Uses OpenZeppelin `AccessControl` for role management.

### Max Supply

The contract prevents minting above the maximum token supply.

### Custom Errors

Gas-optimized custom Solidity errors are implemented.

---

## Test Coverage

The project includes automated tests for:

- Deployment
- Access control
- Minting
- Burning
- Max supply protection
- Revert cases

---

## Deployment

Successfully deployed and verified on Ethereum Sepolia Testnet.

### Contract Address

```text
0xA2CF088f1EeB7EAf263824289A57C4F57810738D
```

### Etherscan

https://sepolia.etherscan.io/address/0xA2CF088f1EeB7EAf263824289A57C4F57810738D#code

---

## Install

```bash
npm install
```

---

## Compile

```bash
npx hardhat compile
```

---

## Run Tests

```bash
npx hardhat test
```

---

## Deploy

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## Verify Contract

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS "My Token" "MTK" 1000 10000
```

---

## Author

Cihat Tuncay
