import { expect } from "chai";
import { network } from "hardhat";

let ethers: any;

describe("MyToken", function () {
  let token: any;
  let owner: any;
  let user1: any;
  let user2: any;

  const tokenName = "My Token";
  const tokenSymbol = "MTK";
  const initialSupplyAmount = 1000;
  const maxSupplyAmount = 10000;

  beforeEach(async function () {
    const connection = await network.connect();
    ethers = connection.ethers;

    [owner, user1, user2] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");

    token = await MyToken.deploy(
      tokenName,
      tokenSymbol,
      initialSupplyAmount,
      maxSupplyAmount,
    );

    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct token name", async function () {
      expect(await token.name()).to.equal(tokenName);
    });

    it("should set the correct token symbol", async function () {
      expect(await token.symbol()).to.equal(tokenSymbol);
    });

    it("should assign initial supply to the owner", async function () {
      const expectedSupply = ethers.parseEther(initialSupplyAmount.toString());
      const ownerBalance = await token.balanceOf(owner.address);

      expect(ownerBalance).to.equal(expectedSupply);
    });

    it("should set the correct max supply", async function () {
      const expectedMaxSupply = ethers.parseEther(maxSupplyAmount.toString());
      const actualMaxSupply = await token.maxSupply();

      expect(actualMaxSupply).to.equal(expectedMaxSupply);
    });

    it("should give DEFAULT_ADMIN_ROLE to the deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();

      const hasAdminRole = await token.hasRole(
        DEFAULT_ADMIN_ROLE,
        owner.address,
      );

      expect(hasAdminRole).to.equal(true);
    });

    it("should give MINTER_ROLE to the deployer", async function () {
      const MINTER_ROLE = await token.MINTER_ROLE();

      const hasMinterRole = await token.hasRole(MINTER_ROLE, owner.address);

      expect(hasMinterRole).to.equal(true);
    });
  });

  describe("Access Control", function () {
    it("should allow admin to grant MINTER_ROLE", async function () {
      const MINTER_ROLE = await token.MINTER_ROLE();

      await token.grantRole(MINTER_ROLE, user1.address);

      const hasMinterRole = await token.hasRole(MINTER_ROLE, user1.address);

      expect(hasMinterRole).to.equal(true);
    });

    it("should allow admin to revoke MINTER_ROLE", async function () {
      const MINTER_ROLE = await token.MINTER_ROLE();

      await token.grantRole(MINTER_ROLE, user1.address);
      await token.revokeRole(MINTER_ROLE, user1.address);

      const hasMinterRole = await token.hasRole(MINTER_ROLE, user1.address);

      expect(hasMinterRole).to.equal(false);
    });
  });

  describe("Minting", function () {
    it("should allow minter to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");

      await token.mint(user1.address, mintAmount);

      const userBalance = await token.balanceOf(user1.address);

      expect(userBalance).to.equal(mintAmount);
    });

    it("should increase total supply after mint", async function () {
      const mintAmount = ethers.parseEther("100");

      const initialTotalSupply = await token.totalSupply();

      await token.mint(user1.address, mintAmount);

      const finalTotalSupply = await token.totalSupply();

      expect(finalTotalSupply).to.equal(initialTotalSupply + mintAmount);
    });

    it("should allow a granted minter to mint tokens", async function () {
      const MINTER_ROLE = await token.MINTER_ROLE();
      const mintAmount = ethers.parseEther("100");

      await token.grantRole(MINTER_ROLE, user1.address);
      await token.connect(user1).mint(user2.address, mintAmount);

      const user2Balance = await token.balanceOf(user2.address);

      expect(user2Balance).to.equal(mintAmount);
    });

    it("should not allow non-minter to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");

      await expect(
        token.connect(user1).mint(user2.address, mintAmount),
      ).to.be.revertedWithCustomError(
        token,
        "AccessControlUnauthorizedAccount",
      );
    });

    it("should revert when minting to zero address", async function () {
      const mintAmount = ethers.parseEther("100");

      await expect(
        token.mint(ethers.ZeroAddress, mintAmount),
      ).to.be.revertedWithCustomError(token, "MyToken__ZeroAddress");
    });

    it("should revert when mint amount is zero", async function () {
      await expect(token.mint(user1.address, 0)).to.be.revertedWithCustomError(
        token,
        "MyToken__AmountMustBeGreaterThanZero",
      );
    });

    it("should revert when mint exceeds max supply", async function () {
      const excessiveAmount = ethers.parseEther("100000");

      await expect(
        token.mint(user1.address, excessiveAmount),
      ).to.be.revertedWithCustomError(token, "MyToken__MaxSupplyExceeded");
    });
  });

  describe("Burning", function () {
    it("should allow token holder to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("100");

      const initialBalance = await token.balanceOf(owner.address);

      await token.burn(burnAmount);

      const finalBalance = await token.balanceOf(owner.address);

      expect(finalBalance).to.equal(initialBalance - burnAmount);
    });

    it("should reduce total supply after burn", async function () {
      const burnAmount = ethers.parseEther("100");

      const initialTotalSupply = await token.totalSupply();

      await token.burn(burnAmount);

      const finalTotalSupply = await token.totalSupply();

      expect(finalTotalSupply).to.equal(initialTotalSupply - burnAmount);
    });
  });
});
