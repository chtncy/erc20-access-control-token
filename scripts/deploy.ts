import { network } from "hardhat";

async function main() {
  const connection: any = await network.create();
  const ethers = connection.ethers;

  const [deployer] = await ethers.getSigners();

  const deployerBalance = await ethers.provider.getBalance(deployer.address);

  console.log("Network:", connection.networkName);
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(deployerBalance), "ETH");

  if (deployerBalance === 0n) {
    throw new Error(
      "Deployer balance is 0. Send Sepolia ETH to the deployer address above.",
    );
  }

  const tokenName = "My Token";
  const tokenSymbol = "MTK";
  const initialSupply = 1000;
  const maxSupply = 10000;

  console.log("Deploying MyToken on sepolia...");

  const myToken = await ethers.deployContract("MyToken", [
    tokenName,
    tokenSymbol,
    initialSupply,
    maxSupply,
  ]);

  await myToken.waitForDeployment();

  const tokenAddress = await myToken.getAddress();

  console.log("MyToken deployed successfully!");
  console.log("Contract address:", tokenAddress);
  console.log("Token name:", tokenName);
  console.log("Token symbol:", tokenSymbol);
  console.log("Initial supply:", initialSupply);
  console.log("Max supply:", maxSupply);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
