const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  it("picks a random first, second and third word", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    const TOKEN_ID = 0;

    const firstWord = await nft.pickRandomFirstWord(TOKEN_ID);
    const secondWord = await nft.pickRandomSecondWord(TOKEN_ID);
    const thirdWord = await nft.pickRandomThirdWord(TOKEN_ID);

    expect(firstWord).to.be.a('string');
    expect(secondWord).to.be.a('string');
    expect(thirdWord).to.be.a('string');
  });

  it("mints an NFT", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    let totalSupply = await nft.getTotalSupply();
    expect(totalSupply).to.equal(50);

    let tx = await nft.mint();
    await tx.wait();
    totalSupply = await nft.getTotalSupply();
    expect(totalSupply).to.equal(49);

    tx = await nft.mint();
    await tx.wait();
    totalSupply = await nft.getTotalSupply();
    expect(totalSupply).to.equal(48);
  });
});
