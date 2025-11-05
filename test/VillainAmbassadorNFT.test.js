const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VillainAmbassadorNFT", function () {
  let contract, owner, minter, addr1, addr2;
  let MINTER_ROLE, DEFAULT_ADMIN_ROLE;

  beforeEach(async function () {
    [owner, minter, addr1, addr2] = await ethers.getSigners();

    const VillainAmbassadorNFT = await ethers.getContractFactory("VillainAmbassadorNFT");
    contract = await VillainAmbassadorNFT.deploy("https://test.com/api/metadata/");
    await contract.waitForDeployment();

    // ロールを取得
    MINTER_ROLE = await contract.MINTER_ROLE();
    DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();

    // minterにMINTER_ROLEを付与
    await contract.grantRole(MINTER_ROLE, minter.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should set initial maxSupply to 0 (unlimited)", async function () {
      expect(await contract.maxSupply()).to.equal(0);
    });

    it("Should set initial totalSupply to 0", async function () {
      expect(await contract.totalSupply()).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should grant MINTER_ROLE correctly", async function () {
      expect(await contract.hasRole(MINTER_ROLE, minter.address)).to.be.true;
    });

    it("Should allow minter to mint", async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      expect(await contract.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should reject minting from non-minter", async function () {
      await expect(
        contract.connect(addr1).mint(addr1.address, 2, "TEST1")
      ).to.be.reverted;
    });

    it("Should allow admin to revoke MINTER_ROLE", async function () {
      await contract.revokeRole(MINTER_ROLE, minter.address);
      expect(await contract.hasRole(MINTER_ROLE, minter.address)).to.be.false;
    });

    it("Should prevent revoked minter from minting", async function () {
      await contract.revokeRole(MINTER_ROLE, minter.address);
      await expect(
        contract.connect(minter).mint(addr1.address, 2, "TEST1")
      ).to.be.reverted;
    });

    it("Should only allow admin to set base URI", async function () {
      await expect(
        contract.connect(minter).setBaseURI("https://new.com/")
      ).to.be.reverted;
    });

    it("Should only allow admin to set max supply", async function () {
      await expect(
        contract.connect(minter).setMaxSupply(100)
      ).to.be.reverted;
    });

    it("Should allow minter to update token rarity", async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      await contract.connect(minter).setTokenRarity(1, 5);
      expect(await contract.tokenRarity(1)).to.equal(5);
    });

    it("Should allow minter to update token code", async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      await contract.connect(minter).setTokenCode(1, "NEW01");
      expect(await contract.tokenCode(1)).to.equal("NEW01");
    });
  });

  describe("Minting", function () {
    it("Should mint NFT with correct rarity and code", async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      expect(await contract.tokenRarity(1)).to.equal(2);
      expect(await contract.tokenCode(1)).to.equal("TEST1");
      expect(await contract.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should reject invalid rarity", async function () {
      await expect(
        contract.connect(minter).mint(addr1.address, 8, "TEST1")
      ).to.be.revertedWith("Invalid rarity");
    });

    it("Should reject empty code", async function () {
      await expect(
        contract.connect(minter).mint(addr1.address, 2, "")
      ).to.be.revertedWith("Code cannot be empty");
    });

    it("Should return correct tokenURI", async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      expect(await contract.tokenURI(1)).to.equal("https://test.com/api/metadata/1");
    });

    it("Should update baseURI correctly", async function () {
      await contract.setBaseURI("https://new.com/api/metadata/");
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      expect(await contract.tokenURI(1)).to.equal("https://new.com/api/metadata/1");
    });

    it("Should track totalSupply correctly", async function () {
      expect(await contract.totalSupply()).to.equal(0);
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      expect(await contract.totalSupply()).to.equal(1);
      await contract.connect(minter).mint(addr1.address, 3, "TEST2");
      expect(await contract.totalSupply()).to.equal(2);
    });

    it("Should emit NFTMinted event", async function () {
      await expect(contract.connect(minter).mint(addr1.address, 2, "TEST1"))
        .to.emit(contract, "NFTMinted")
        .withArgs(1, addr1.address, 2, "TEST1");
    });
  });

  describe("Property Updates", function () {
    beforeEach(async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
    });

    it("Should update token rarity correctly", async function () {
      await contract.connect(minter).setTokenRarity(1, 5);
      expect(await contract.tokenRarity(1)).to.equal(5);
    });

    it("Should emit RarityUpdated event", async function () {
      await expect(contract.connect(minter).setTokenRarity(1, 5))
        .to.emit(contract, "RarityUpdated")
        .withArgs(1, 2, 5);
    });

    it("Should update token code correctly", async function () {
      await contract.connect(minter).setTokenCode(1, "NEW01");
      expect(await contract.tokenCode(1)).to.equal("NEW01");
    });

    it("Should emit CodeUpdated event", async function () {
      await expect(contract.connect(minter).setTokenCode(1, "NEW01"))
        .to.emit(contract, "CodeUpdated")
        .withArgs(1, "TEST1", "NEW01");
    });

    it("Should reject rarity update for non-existent token", async function () {
      await expect(
        contract.connect(minter).setTokenRarity(999, 5)
      ).to.be.revertedWithCustomError(contract, "ERC721NonexistentToken");
    });

    it("Should reject code update with empty string", async function () {
      await expect(
        contract.connect(minter).setTokenCode(1, "")
      ).to.be.revertedWith("Code cannot be empty");
    });
  });

  describe("Max Supply", function () {
    it("Should set max supply correctly", async function () {
      await contract.setMaxSupply(100);
      expect(await contract.maxSupply()).to.equal(100);
    });

    it("Should emit MaxSupplySet event", async function () {
      await expect(contract.setMaxSupply(100))
        .to.emit(contract, "MaxSupplySet")
        .withArgs(100);
    });

    it("Should reject minting when max supply reached", async function () {
      await contract.setMaxSupply(2);
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      await contract.connect(minter).mint(addr1.address, 3, "TEST2");
      await expect(
        contract.connect(minter).mint(addr1.address, 4, "TEST3")
      ).to.be.revertedWith("Max supply reached");
    });

    it("Should allow setting max supply to 0 (unlimited)", async function () {
      await contract.setMaxSupply(2);
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      await contract.connect(minter).mint(addr1.address, 3, "TEST2");

      // 上限を無制限に戻す
      await contract.setMaxSupply(0);

      // 3枚目以降もミント可能
      await expect(
        contract.connect(minter).mint(addr1.address, 4, "TEST3")
      ).to.not.be.reverted;
    });

    it("Should reject setting max supply below current supply", async function () {
      await contract.connect(minter).mint(addr1.address, 2, "TEST1");
      await contract.connect(minter).mint(addr1.address, 3, "TEST2");
      await contract.connect(minter).mint(addr1.address, 4, "TEST3");

      // 既に3枚発行済みなので2枚には設定できない
      await expect(
        contract.setMaxSupply(2)
      ).to.be.revertedWith("Cannot set below current supply");
    });
  });

  describe("Rarity Names", function () {
    it("Should return correct rarity names", async function () {
      expect(await contract.getRarityName(0)).to.equal("Common");
      expect(await contract.getRarityName(1)).to.equal("Uncommon");
      expect(await contract.getRarityName(2)).to.equal("Rare");
      expect(await contract.getRarityName(3)).to.equal("Epic");
      expect(await contract.getRarityName(4)).to.equal("Legendary");
      expect(await contract.getRarityName(5)).to.equal("Mythic");
      expect(await contract.getRarityName(6)).to.equal("Galaxy");
      expect(await contract.getRarityName(7)).to.equal("Origin");
    });

    it("Should reject invalid rarity for getRarityName", async function () {
      await expect(
        contract.getRarityName(8)
      ).to.be.revertedWith("Invalid rarity");
    });
  });

  describe("Supports Interface", function () {
    it("Should support ERC721 interface", async function () {
      // ERC721 interface ID
      expect(await contract.supportsInterface("0x80ac58cd")).to.be.true;
    });

    it("Should support AccessControl interface", async function () {
      // AccessControl interface ID
      expect(await contract.supportsInterface("0x7965db0b")).to.be.true;
    });
  });
});
