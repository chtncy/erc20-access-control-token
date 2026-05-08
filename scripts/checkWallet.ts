import "dotenv/config";
import { Wallet } from "ethers";

const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("SEPOLIA_PRIVATE_KEY not found");
}

const wallet = new Wallet(privateKey);

console.log("Address from .env private key:");
console.log(wallet.address);